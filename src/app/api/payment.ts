import * as joi from "joi";
import asyncMiddleware from "middleware-async";

import { logger } from "../lib/logger";
import { ALREADY_REPORTED, INTERNAL, OK } from "./api-codes";
import { schemaValidatorMiddleware } from "../lib/schema-validator";
import { applyPayment, PaymentDto } from "../service/payment";

export const route = "/accounts/payment";
export const method = "post";

const schema = joi.object({
    paymentId: joi.string().required(),
    email: joi .string() .email() .required(),
    amount: joi.number().min(0).required()
});

export const schemaValidator = schemaValidatorMiddleware(schema);

export const execute = asyncMiddleware(async (req, res) => {
    const paymentDto = req.body as PaymentDto;

    const { ok, repeated } = await applyPayment(paymentDto);

    if (repeated) {
        // We may set up the monitorings and alerts for this kind of logs
        logger.warn("The duplicated payment detected");

        res.sendStatus(ALREADY_REPORTED);
        return;
    }

    res.sendStatus(ok ? OK : INTERNAL);
});
