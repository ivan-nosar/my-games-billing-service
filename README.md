# Тестовое задание для Backend разработчика (Express + Queue)

Сервис состоит из четырех отдельных компонентов, каждый из которых запакован в отдельный Docker-контейнер:
- `service`: Основной сервис. `Node.js`-приложение. Точка входа: `./src/app/app.ts`
- `service-database`: Контейнер с `Postgres` БД, используется для хранения данных сервиса
- `scheduler`: Сервис с CRON-job, который запрашивает "вывод" средств пользователей
  у `scheduler-executor` каждый день в 23:00. Умеет ретраить упавшие запросы.
  Основан на [`agenda`](https://github.com/agenda/agenda) и [`NATS`](https://nats.io/).
  Точка входа: `./src/app/jobs/scheduler.ts`
- `scheduler-executor`: Сервис, слушающий NATS-сообщения на вывод средств пользователей и
  выполняющий транзакции вывода. Точка входа: `./src/app/jobs/executor.ts`
- `scheduler-database`: Контейнер с `Mongo` БД, используется для хранения информации о CRON-job'ах
- `nats`: Контейнер с развернутым сервисом NATS, через который пробрасываются сообщения между сервисами
  `scheduler` и `scheduler-executor`

В первую очередь необходимо подготовить файл конфигурации:

```sh
cp .env.example .env
```

> **Внимание!** Значения переменных в `.env.example` установлены для работы сервиса внутри Docker.
> Если вы захотите оставить БД в Docker, а `Node.js`-сервисы запустить локально - придется поправить
> значения `MONGO_HOST`, `POSTGRES_HOST` и `NATS_HOST` на `localhost`.
> Подробнее [здесь](https://docs.docker.com/compose/networking/)

Образы БД и `nats` собираются из публичных образов сразу в docker-compose, а вот `service`, `scheduler` и
`scheduler-executor` основаны на одном Docker-образе, который необходимо предварительно собрать из исходников:

```sh
docker build -t ivan-nosar/billing-service .
```

Оркестрируется запуск сервисов через `docker-compose`. Для того, чтобы поднять все сервисы, воспользуйтесь командой:

```sh
docker-compose up --detach
```

После того, как сервисы `service-database` и `service` поднимутся, вы сможете взаимодействовать с АПИ:

```sh
curl localhost:8080/accounts/payment -X POST -H "Content-Type: application/json" -d '{"paymentId": "id-1", "email": "a@y.com", "amount": 100.753}'
```

Для локальной разработки воспользуйтесь командами:

```sh
npm install # Установить зависимости проекта

npm run build # Собрать TS код

npm run lint # Проверить код линтером. Для автоматического устранения проблем воспользуйтесть скриптом `lint:fix`

npm run start:service # Запустить собранный сервис API

npm run start:scheduler # Запустить шедулер с CRON-job'ой

npm run start:scheduler-executor # Запустить исполнитель вывода средств

npm run start # Одновременный параллельный запуск сервиса и шедулера
```
