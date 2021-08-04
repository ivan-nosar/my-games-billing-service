import * as dotenv from "dotenv";

dotenv.config();

export const config = {
    "app.disableLogs": process.env.DISABLE_LOGS !== "false",
    "app.colorizeLogs": process.env.COLORIZE_LOGS !== "false",
    "app.httpPort": Number(process.env.HTTP_PORT),
    "db.host": process.env.POSTGRES_HOST,
    "db.port": Number(process.env.POSTGRES_PORT),
    "db.user": process.env.POSTGRES_USER,
    "db.password": process.env.POSTGRES_PASSWORD,
    "db.name": process.env.POSTGRES_DB,
};
