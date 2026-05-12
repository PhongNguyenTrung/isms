# analytics-service

> Operational analytics and live dashboard backend — consumes order events, materializes aggregates in Postgres + Redis, and pushes real-time updates to the manager dashboard over Socket.io.

[![Port](https://img.shields.io/badge/port-3007-blue)]()
[![Node](https://img.shields.io/badge/node-20+-339933)]()
[![Redis](https://img.shields.io/badge/redis-7-DC382D?logo=redis&logoColor=white)]()
[![Socket.IO](https://img.shields.io/badge/socket.io-4.x-010101)]()

## Overview

This service is the read-side of the platform:

1. **Consume** `orders` and `kitchen_completed` from Kafka.
2. **Maintain** rolling aggregates (counts, average prep time, peak windows) in Postgres, with hot lookups cached in Redis.
3. **Push** dashboard deltas to subscribed clients through Socket.io.
4. **Expose** REST endpoints for report queries and predictive insights.

## Tech Stack

- **Runtime:** Node.js 20+, Express 5
- **Persistence:** PostgreSQL (`pg`), Redis (`redis`)
- **Messaging:** KafkaJS (consumer)
- **Realtime:** Socket.io 4.x

## API

| Method | Path                                          | Description                                              |
| ------ | --------------------------------------------- | -------------------------------------------------------- |
| `GET`  | `/api/analytics/reports/order-flow?period=…`  | Order-flow report aggregated by `period` (e.g. `hour`)   |
| `GET`  | `/api/analytics/insights/predictive`          | Forecasted demand / busy-period predictions              |
| `GET`  | `/health`                                     | Liveness probe                                           |

### Socket.io

- **Namespace:** default (`/`); proxied by the manager-dashboard at `/analytics.io` in dev (rewritten to `/socket.io`).
- **Events emitted to clients:** dashboard tile updates as orders and completions stream in.

## Events

| Direction | Topic                | Purpose                                            |
| --------- | -------------------- | -------------------------------------------------- |
| Consumes  | `orders`             | Increment new-order counters, table-turnover stats |
| Consumes  | `kitchen_completed`  | Finalize prep-time metrics, emit dashboard deltas  |

## Configuration

| Variable        | Required | Default | Description                              |
| --------------- | -------- | ------- | ---------------------------------------- |
| `PORT`          | no       | `3007`  | HTTP + Socket.io listen port             |
| `KAFKA_BROKERS` | yes      | —       | Comma-separated bootstrap servers        |
| `DB_HOST`       | yes      | —       | PostgreSQL host                          |
| `DB_PORT`       | yes      | `5432`  | PostgreSQL port                          |
| `DB_USER`       | yes      | —       | PostgreSQL user                          |
| `DB_PASSWORD`   | yes      | —       | PostgreSQL password                      |
| `DB_NAME`       | yes      | —       | PostgreSQL database                      |
| `REDIS_HOST`    | yes      | —       | Redis host                               |
| `REDIS_PORT`    | yes      | `6379`  | Redis port                               |

## Running

### Inside the stack

```bash
docker compose up -d analytics-service
```

This service has a host-port mapping (`3007:3007`) so the dashboard can reach Socket.io directly during development.

### Standalone

```bash
npm install
node src/index.js
```

Requires Postgres, Redis, and Kafka to be reachable.

## Project Structure

```
src/
├── config/          # Postgres, Redis, Kafka clients
├── consumers/       # orders + kitchen_completed consumers
├── controllers/     # Report and insight HTTP handlers
├── repositories/    # SQL + Redis access
├── routes/
├── socket/          # Dashboard namespace and broadcasts
└── index.js
```

## Notes

- Redis is used for sub-second dashboard reads; Postgres remains the source of truth.
- The predictive endpoint currently returns heuristic forecasts; the model interface is pluggable for future ML integration.
