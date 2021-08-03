import * as dotenv from "dotenv";

dotenv.config();

export const config = {
    "app.disableLogs": process.env.DISABLE_LOGS !== "false",
    "app.colorizeLogs": process.env.COLORIZE_LOGS !== "false",
    "app.httpPort": Number(process.env.HTTP_PORT),
};
