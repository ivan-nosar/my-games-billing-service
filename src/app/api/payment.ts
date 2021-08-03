import * as joi from "joi";
import asyncMiddleware from "middleware-async";

import { schemaValidatorMiddleware } from "../lib/schema-validator";

export const route = "/accounts/payment";
export const method = "post";

const schema = joi.object({
    paymentId: joi.string().required(),
    email: joi
        .string()
        .email() // Must have two domain parts e.g. example.com, TLD must be a valid name listed on the IANA registry
        .required(),
    amount: joi.number().required(),
});

export const schemaValidator = schemaValidatorMiddleware(schema);

export const execute = asyncMiddleware(async (req, res) => {
    res.send(req.body);
});
