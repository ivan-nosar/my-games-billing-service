import * as joi from "joi";
import asyncMiddleware from "middleware-async";

import { schemaValidatorMiddleware } from "../lib/schema-validator";

export const route = "/accounts/transfer";
export const method = "post";

const schema = joi.object({
    userFrom: joi.string().required(),
    userTo: joi.string().required(),
    amount: joi.number().required(),
});

export const schemaValidator = schemaValidatorMiddleware(schema);

export const execute = asyncMiddleware(async (req, res) => {
    res.send(req.body);
});
