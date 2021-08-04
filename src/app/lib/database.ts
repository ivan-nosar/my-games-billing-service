import { createConnection } from "typeorm";

import { logger } from "../lib/logger";
import { config } from "../config";
import { stringifyError } from "../helpers/error";
import { User } from "../model/user";
import { AccountTransaction } from "../model/account-transaction";

export async function connectDatabase(): Promise<void> {
    try {
        await createConnection({
            type: "postgres",
            host: config["db.host"],
            port: config["db.port"],
            username: config["db.user"],
            password: config["db.password"],
            database: config["db.name"],
            entities: [
                User,
                AccountTransaction
            ],
            synchronize: true,
            logging: false
        });
    } catch (error) {
        logger.error(`The error detected at the top level: ${stringifyError(error)}`);
        throw error;
    }
}
