
import * as Boom from "@hapi/boom";
import { Request, Response, NextFunction } from "express";
import asyncMiddleware from "middleware-async";
import { ObjectSchema } from "joi";

type AsyncMiddlware = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export function schemaValidatorMiddleware(schema: ObjectSchema): AsyncMiddlware {
    return asyncMiddleware(async (req, res, next) => {
        const validationResult = schema.validate(req.body);

        if (validationResult.error) {
            throw Boom.badRequest(validationResult.error.message);
        }

        next();
    });
}
