import { connect, StringCodec, Subscription } from "nats";

import { QUEUE_REQUEST_LABEL } from "../jobs/scheduler";
import { logger } from "../lib/logger";
import { config } from "../config";
import { retrieveFunds } from "../service/retrieve-funds";

const stringCodec = StringCodec();

main();

async function main() {
    const natsConnectionString = `${config["scheduler.queue.host"]}:${config["scheduler.queue.clientPort"]}`;
    const connection = await connect({ servers: natsConnectionString });

    logger.info("Queue job executor started");

    const subscription = connection.subscribe(QUEUE_REQUEST_LABEL);

    try {
        await subscriptionHandler(subscription);

        const error = await connection.closed();

        if (error) {
            throw error;
        }
    } catch (error) {
        logger.error(`The error detected during the job execution: ${error.message}`);
    }

    logger.info("Queue job executor stopped");
}

async function subscriptionHandler(subscription: Subscription) {
    for await (const message of subscription) {
        const processedUsers = await retrieveFunds();

        const answer = stringCodec.encode(`${processedUsers}`);

        if (message.respond(answer)) {
            logger.warn(`Finished processing ${processedUsers} accounts`);
        } else {
            logger.warn(`Error sending the result of processing of ${processedUsers} accounts`);
        }
    }
}
