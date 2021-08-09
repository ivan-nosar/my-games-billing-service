import { Agenda } from "agenda";
import { connect, Empty, NatsConnection, StringCodec } from "nats";

import { logger } from "../lib/logger";
import { config } from "../config";
import { sleep } from "../helpers/async";
import { INVALID_RETRIEVED_COUNT } from "../service/retrieve-funds";

const MONGO_CONNECTION_STRING =
    `mongodb://${config["scheduler.db.host"]}:${config["scheduler.db.port"]}/${config["scheduler.db.name"]}`;
const JOB_NAME = "retrieve-funds";
export const QUEUE_REQUEST_LABEL = "retrieve-users";

const stringCodec = StringCodec();

main();

async function main(): Promise<void> {
    const agenda = new Agenda({
        defaultConcurrency: 1,
        db: { address: MONGO_CONNECTION_STRING }
    });

    agenda.define(JOB_NAME, runBulkRetrieval);

    await agenda.start();

    await agenda.schedule(config["scheduler.jobSchedule"], JOB_NAME, null);
}

async function runBulkRetrieval() {
    const natsConnectionString = `${config["scheduler.queue.host"]}:${config["scheduler.queue.clientPort"]}`;
    const connection = await connect({ servers: natsConnectionString });

    logger.info("Started bulk retrieval");

    try {
        let processedUsers = 0;

        do {
            processedUsers = await makeRetrievalRequest(connection);

            await sleep(config["scheduler.bulkProcessingDelay"]);
        } while (processedUsers !== 0);
    } catch (error) {
        logger.error(`The error detected during the bulk retrieval: ${error.message}`);
    }

    await connection.close();

    logger.info("Finished bulk retrieval");
}

async function makeRetrievalRequest(connection: NatsConnection): Promise<number> {
    try {
        const answer = await connection.request(
            QUEUE_REQUEST_LABEL,
            Empty,
            { timeout: config["scheduler.bulkProcessingTimeout"] }
        );

        const jobResult = Number(stringCodec.decode(answer.data));

        if (jobResult === INVALID_RETRIEVED_COUNT) {
            throw new Error("Invalid number of the accounts processed received");
        }

        return jobResult;
    } catch (error) {
        logger.error(`The error detected during the retrieving funds: ${error.message}`);

        const delayTimeout = config["scheduler.bulkProcessingDelay"];

        logger.warn(`Waiting a ${delayTimeout} ms before retry`);

        await sleep(delayTimeout);

        logger.warn("Retrying");

        return await makeRetrievalRequest(connection);
    }
}
