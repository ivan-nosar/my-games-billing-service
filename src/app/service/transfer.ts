import { getConnection, In } from "typeorm";

import { logger } from "../lib/logger";
import { stringifyError } from "../helpers/error";
import { AccountTransaction, TransactionType } from "../model/account-transaction";
import { User } from "../model/user";

export interface TransferDto {
    userFrom: number;
    userTo: number;
    amount: number;
}

interface TransferInfo {
    ok: boolean;
    invalidUserId: boolean;
    insufficient: boolean;
}

export async function applyTransfer({ userFrom, userTo, amount }: TransferDto): Promise<TransferInfo> {
    return getConnection().transaction(async transactionalEntityManager => {

        try {
            const userRepo = await transactionalEntityManager.getRepository(User);
            const users = await userRepo.find({ id: In([userFrom, userTo]) });

            if (users.length < 2) {
                return { ok: false, invalidUserId: true, insufficient: false };
            }

            const sourceUser = users.find(user => user.id === userFrom)!;

            if (sourceUser.score < amount) {
                return { ok: false, invalidUserId: false, insufficient: true };
            }

            const destinationUser = users.find(user => user.id === userTo)!;
            destinationUser.score += amount;
            sourceUser.score -= amount;
            await userRepo.save([sourceUser, destinationUser]);

            const accountTransactionRepo = await transactionalEntityManager.getRepository(AccountTransaction);
            const transaction = new AccountTransaction();
            transaction.amount = amount;
            transaction.accountFrom = userFrom;
            transaction.accountTo = userTo;
            transaction.type = TransactionType.TRANSFER;

            await accountTransactionRepo.save(transaction);

            return { ok: true, invalidUserId: false, insufficient: false };
        } catch(error) {
            logger.error(`Error at 'applyTransfer': ${stringifyError(error)}`);
            return { ok: false, invalidUserId: false, insufficient: false };
        }
    });
}
