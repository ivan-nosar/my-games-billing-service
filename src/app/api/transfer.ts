import * as joi from "joi";
import asyncMiddleware from "middleware-async";

import { BAD_REQUEST, INTERNAL, CONFLICT, OK } from "./api-codes";
import { schemaValidatorMiddleware } from "../lib/schema-validator";
import { applyTransfer, TransferDto } from "../service/transfer";

export const route = "/accounts/transfer";
export const method = "post";

const schema = joi.object({
    userFrom: joi.number().required(),
    userTo: joi.number().required(),
    amount: joi.number().required(),
});

export const schemaValidator = schemaValidatorMiddleware(schema);

export const execute = asyncMiddleware(async (req, res) => {
    const transferDto = req.body as TransferDto;

    const { ok, invalidUserId, insufficient } = await applyTransfer(transferDto);

    if (invalidUserId) {
        res
            .status(BAD_REQUEST)
            .json({ message: "One of the userFrom or userTo properties is invalid" });
        return;
    }

    if (insufficient) {
        res
            .status(CONFLICT)
            .json({ message: "Insufficient funds" });
        return;
    }

    res.sendStatus(ok ? OK : INTERNAL);
});
