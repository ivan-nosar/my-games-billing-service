import { createConnection, Connection } from "typeorm";

import { logger } from "../lib/logger";
import { config } from "../config";
import { stringifyError } from "../helpers/error";
import { User } from "../model/user";
import { AccountTransaction } from "../model/account-transaction";

export async function connectServiceDatabase(): Promise<Connection> {
    try {
        return await createConnection({
            type: "postgres",
            host: config["app.db.host"],
            port: config["app.db.port"],
            username: config["app.db.user"],
            password: config["app.db.password"],
            database: config["app.db.name"],
            entities: [
                User,
                AccountTransaction
            ],
            synchronize: true,
            logging: false
        });
    } catch (error) {
        logger.error(`The error detected on the service database connection: ${stringifyError(error)}`);
        throw error;
    }
}
