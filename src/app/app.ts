import { logger } from "./lib/logger";
import * as express from "express";
import { config } from "./config";
import { stringifyError } from "./helpers/error";
import { buildApiRouter } from "./api";

async function startApp() {
    const app = express();

    app.use("/", buildApiRouter());

    app
        .listen(config["app.httpPort"], () => {
            logger.info(`Listening on port ${config["app.httpPort"]}`);
        })
        .on("error", error => {
            logger.error(`The error detected at the top level: ${stringifyError(error)}`);
            process.exit(1);
        });
}

startApp();
