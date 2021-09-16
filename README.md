# Node.js + Typescript + Express + Agenda.js sample app

This service consists of four separate parts, each of those is packed inside a Docker container:

- `service`: The main component. A `Node.js` app. Entry point: `./src/app/app.ts`
- `service-database`: The `Postgres` DB container. Used to store the service data
- `scheduler`: The CRON-job service, that asks the `scheduler-executor` service to start
  the users' funds retrieval at the 11:00 PM (23:00) each day. Capable to retry the failed requests.
  Based on the [`agenda`](https://github.com/agenda/agenda) and the [`NATS`](https://nats.io/).
  Entry point: `./src/app/jobs/scheduler.ts`
- `scheduler-executor`: The service responsible for listening the NATS-messages and starting
  the users' funds retrieving transactions. Entry point: `./src/app/jobs/executor.ts`
- `scheduler-database`: The `Mongo` DB container. Used to store the CRON-jobs data
- `nats`: The `NATS` service container. Used to establish the cross-service communication between the `scheduler` and `scheduler-executor` services

First of all the config file must be prepared:

```sh
cp .env.example .env
```

> **Important!** The values in `.env.example` were set to fit running all the services inside a Docker.
> If you want to keep running your DB services inside a Docker while the `Node.js` apps will be deployed
> locally on your working machine - you'll have to update the `MONGO_HOST`, `POSTGRES_HOST`, and `NATS_HOST` variables with the `localhost` value.
> Read more [here](https://docs.docker.com/compose/networking/)

The DB and `nats` containers are built by `docker-compose` using the public images. Meanwhile, the
`service`, `scheduler`, and `scheduler-executor` services are based one a single Docker-image
that must be built from the source code:

```sh
docker build -t ivan-nosar/billing-service .
```

Service up-and-running is orchestrated by the `docker-compose`. In order to up all the services - use the following command:

```sh
docker-compose up --detach
```

Once the `service-database` and `service` service will be up, you'll be able to interact with the API:

```sh
curl localhost:8080/accounts/payment -X POST -H "Content-Type: application/json" -d '{"paymentId": "id-1", "email": "a@y.com", "amount": 100.753}'
```

The following commands might be handy for the local development:

```sh
npm install # Install the project's dependencies

npm run build # Build TS code

npm run lint # Run the linter. Use `lint:fix` in order to fix all auto-fixable issues

npm run start:service # Run the built API service

npm run start:scheduler # Run the built CRON-job scheduler

npm run start:scheduler-executor # Run the built funds retrieval service

npm run start # Run the `service` and the `scheduler` services simultaneously
```
