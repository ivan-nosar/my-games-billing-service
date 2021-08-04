import { getConnection } from "typeorm";

import { logger } from "../lib/logger";
import { stringifyError } from "../helpers/error";
import { AccountTransaction, TransactionType } from "../model/account-transaction";
import { User } from "../model/user";

export interface PaymentDto {
    paymentId: string;
    email: string;
    amount: number;
}

interface PaymentInfo {
    ok: boolean;
    repeated: boolean;
}

export async function applyPayment({ paymentId, email, amount }: PaymentDto): Promise<PaymentInfo> {
    return getConnection().transaction(async transactionalEntityManager => {

        try {
            const accountTransactionRepo = await transactionalEntityManager.getRepository(AccountTransaction);

            const storedTransaction = await accountTransactionRepo.findOne({ where : { paymentId } });
            if (storedTransaction) {
                return { ok: false, repeated: true };
            }

            const userRepo = await transactionalEntityManager.getRepository(User);
            let user = await userRepo.findOne({ where: { email } });

            if (!user) {
                user = new User();
                user.email = email;
                user.score = amount;
            } else {
                user.score += amount;
            }

            await userRepo.save(user);

            const transaction = new AccountTransaction();
            transaction.accountTo = user.id;
            transaction.paymentId = paymentId;
            transaction.amount = amount;
            transaction.type = TransactionType.REFILL;

            await accountTransactionRepo.save(transaction);

            return { ok: true, repeated: false };
        } catch(error) {
            logger.error(`Error at 'applyPayment': ${stringifyError(error)}`);
            return { ok: false, repeated: false };
        }
    });
}
