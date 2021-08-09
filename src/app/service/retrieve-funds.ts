import { config } from "../config";
import { connectServiceDatabase } from "../lib/database";
import { User } from "../model/user";
import { AccountTransaction, TransactionType } from "../model/account-transaction";
import { logger } from "../lib/logger";
import { stringifyError } from "../helpers/error";

export const INVALID_RETRIEVED_COUNT = -1;

export async function retrieveFunds(): Promise<number> {

    const connection = await connectServiceDatabase();
    try {
        let result = 0;
        const bulkSize = config["scheduler.bulkSize"];
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
            await userRepo.save(retrievedUsers);

            const retrievalTransactions = usersBulk.map(user => {
                const transaction = new AccountTransaction();
                transaction.accountFrom = user.id;
                transaction.amount = user.score;
                transaction.type = TransactionType.RETRIEVAL;

                return transaction;
            });

            const accountTransactionRepo = await transactionalEntityManager.getRepository(AccountTransaction);
            await accountTransactionRepo.save(retrievalTransactions);

            result = usersBulk.length;
        });

        return result;
    } catch (error) {
        logger.error(`The error detected at recurring job: ${stringifyError(error)}`);
        return INVALID_RETRIEVED_COUNT;
    } finally {
        connection.close();
    }
}
