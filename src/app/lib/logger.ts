import { config } from "../config";
import * as winston from "winston";

const timestampFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)
);
const loggerFormat = config["app.colorizeLogs"] ?
    winston.format.combine(
        winston.format.colorize(),
        timestampFormat
    ) :
    timestampFormat;

export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: "info",
            format: loggerFormat,
            silent: config["app.disableLogs"]
        })
    ],
});
