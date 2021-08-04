import "reflect-metadata";
import * as express from "express";

import { logger } from "./lib/logger";
import { config } from "./config";
import { stringifyError } from "./helpers/error";
import { buildApiRouter } from "./api";
import { connectServiceDatabase } from "./lib/database";

async function startApp() {
    const app = express();

    app.use("/", buildApiRouter());

    app
        .listen(config["app.httpPort"], async () => {
            await connectServiceDatabase();
            logger.info(`Listening on port ${config["app.httpPort"]}`);
        })
        .on("error", error => {
            logger.error(`The error detected at the top level: ${stringifyError(error)}`);
            process.exit(1);
        });
}

startApp();
