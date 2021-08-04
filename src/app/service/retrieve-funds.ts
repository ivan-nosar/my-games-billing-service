import { config } from "../config";
import { connectServiceDatabase } from "../lib/database";
import { User } from "../model/user";
import { AccountTransaction, TransactionType } from "../model/account-transaction";
import { logger } from "../lib/logger";
import { stringifyError } from "../helpers/error";

export async function retrieveFunds(): Promise<boolean> {
    const connection = await connectServiceDatabase();

    const usersCount = await connection
        .createQueryBuilder(User, "user")
        .where("user.score > 0")
        .getCount();

    // Execute bulk update
    try {
        const bulkSize = config["scheduler.bulkSize"];
        for (let i = 0; i < usersCount; i += bulkSize) {
            await connection.transaction(async transactionalEntityManager => {
                const userRepo = await transactionalEntityManager.getRepository(User);

                const usersBulk = await userRepo
                    .createQueryBuilder("user")
                    .where("user.score > 0")
                    .orderBy("id")
                    .take(bulkSize)
                    .getMany();

                const retrievedUsers = usersBulk.map(user => ({
                    ...user,
                    score: 0
                }));
                userRepo.save(retrievedUsers);

                const retrievalTransactions = usersBulk.map(user => {
                    const transaction = new AccountTransaction();
                    transaction.accountFrom = user.id;
                    transaction.amount = user.score;
                    transaction.type = TransactionType.RETRIEVAL;

                    return transaction;
                });

                const accountTransactionRepo = await transactionalEntityManager.getRepository(AccountTransaction);
                accountTransactionRepo.save(retrievalTransactions);
            });

            await sleep(config["scheduler.bulkProcessingDelay"]);
        }
    } catch (error) {
        logger.error(`The error detected at recurring job: ${stringifyError(error)}`);
        return false;
    }

    return true;
}

async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
