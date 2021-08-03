import asyncMiddleware from "middleware-async";

export const route = "/ping";
export const method = "get";

export const execute = asyncMiddleware(async (req, res) => {
    res.send({ ok: true });
});
