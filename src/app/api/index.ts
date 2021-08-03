import * as Boom from "@hapi/boom";
import { json, NextFunction, Request, Response, Router, } from "express";

import { stringifyError } from "../helpers/error";
import { logger } from "../lib/logger";

import * as ping from "./ping";
import * as payment from "./payment";
import * as transfer from "./transfer";

export function buildApiRouter(): Router {
    const router = Router();

    // Apply JSON body parser
    router.use(json());

    // Apply business-logic middleware
    router[ping.method](ping.route, ping.execute);
    router[payment.method](payment.route, payment.schemaValidator, payment.execute);
    router[transfer.method](transfer.route, transfer.schemaValidator, transfer.execute);

    // Handle unmatched route
    router.use((req, res, next) => {
        next(Boom.notFound());
    });

    // Handle errors
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    router.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        let boomError: Boom.Boom;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).type === "entity.parse.failed") {
            // JSON parse error
            boomError = Boom.badRequest("Error parsing request body");
        } else if (!Boom.isBoom(error)) {
            logger.error(`An internal error occured: ${stringifyError(error)}`);
            boomError = Boom.internal();
        } else {
            boomError = error;
        }

        res
            .status(boomError.output.statusCode)
            .json({
                message: boomError.output.payload.message
            });
    });

    return router;
}

// TODO: Plan:

// Joi
// TypeOrm
