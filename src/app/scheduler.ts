import { Agenda } from "agenda";

import { retrieveFunds } from "./service/retrieve-funds";
import { config } from "./config";

const mongoConnectionString =
    `mongodb://${config["scheduler.db.host"]}:${config["scheduler.db.port"]}/${config["scheduler.db.name"]}`;
const jobName = "retrieve-funds";

async function startRecurringJobs(): Promise<void> {
    const agenda = new Agenda({
        defaultConcurrency: 1,
        db: { address: mongoConnectionString }
    });

    agenda.define(jobName, retrieveFunds);

    await agenda.start();

    await agenda.schedule(config["scheduler.jobSchedule"], jobName, null);
}

startRecurringJobs();
