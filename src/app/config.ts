import * as dotenv from "dotenv";

dotenv.config();

export const config = {
    "app.disableLogs": process.env.DISABLE_LOGS !== "false",
    "app.colorizeLogs": process.env.COLORIZE_LOGS !== "false",
    "app.httpPort": Number(process.env.HTTP_PORT),

    "app.db.host": process.env.POSTGRES_HOST ?? "",
    "app.db.port": Number(process.env.POSTGRES_PORT),
    "app.db.user": process.env.POSTGRES_USER ?? "",
    "app.db.password": process.env.POSTGRES_PASSWORD ?? "",
    "app.db.name": process.env.POSTGRES_DB ?? "",

    "scheduler.jobSchedule": process.env.RETRIEVE_JOB_SCHEDULE ?? "",
    "scheduler.bulkSize": Number(process.env.BULK_SIZE) || 100,
    "scheduler.bulkProcessingDelay": Number(process.env.BULK_PROCESSING_DELAY) || 5000,

    "scheduler.db.host": process.env.MONGO_HOST ?? "",
    "scheduler.db.port": Number(process.env.MONGO_PORT),
    "scheduler.db.user": process.env.MONGO_INITDB_ROOT_USERNAME ?? "",
    "scheduler.db.password": process.env.MONGO_INITDB_ROOT_PASSWORD ?? "",
    "scheduler.db.name": process.env.MONGO_INITDB_DATABASE ?? "",
};
