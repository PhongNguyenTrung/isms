# kitchen-service

> Kitchen Display System (KDS) backend — translates orders into kitchen tasks, streams real-time updates to KDS clients via Socket.io, and emits overload alerts.

[![Port](https://img.shields.io/badge/port-3003-blue)]()
[![Node](https://img.shields.io/badge/node-20+-339933)]()
[![Socket.IO](https://img.shields.io/badge/socket.io-4.x-010101)]()

## Overview

The kitchen-service is the operational heart of the kitchen:

1. **Consume `orders`** → break each order into one task per dish/station.
2. **Persist tasks** in PostgreSQL with status (`pending`, `in_progress`, `done`).
3. **Push live updates** to connected KDS screens through Socket.io.
4. **Publish `kitchen_ready`** when an item is ready, allowing waitstaff/UI to react.
5. **Publish `alerts`** when a station is overloaded (configurable threshold).

## Tech Stack

- **Runtime:** Node.js 20+, Express 5
- **Persistence:** PostgreSQL (`pg`)
- **Messaging:** KafkaJS (consumer + producer)
- **Realtime:** Socket.io 4.x
- **Auth:** `jsonwebtoken`

## API

| Method  | Path                                  | Description                              |
| ------- | ------------------------------------- | ---------------------------------------- |
| `GET`   | `/api/kitchen/tasks`                  | List current tasks across all stations   |
| `PATCH` | `/api/kitchen/tasks/:taskId/status`   | Update task status (`in_progress`, `done`) |
| `GET`   | `/health`                             | Liveness probe                           |

### Socket.io

- **Namespace:** default (`/`)
- **Connection URL:** `ws://localhost:3003/socket.io`
- **Events emitted to clients:** `task:created`, `task:updated`, `alert:overload`
- The manager-dashboard proxies `/socket.io` directly to this service in dev.

## Events

| Direction | Topic                | Purpose                                         |
| --------- | -------------------- | ----------------------------------------------- |
| Consumes  | `orders`             | Expand orders into kitchen tasks                |
| Produces  | `kitchen_ready`      | Item ready for pickup                           |
| Produces  | `kitchen_completed`  | Entire order fulfilled                          |
| Produces  | `alerts`             | Station overload, dish flagged for attention    |

## Configuration

| Variable        | Required | Default | Description                                |
| --------------- | -------- | ------- | ------------------------------------------ |
| `PORT`          | no       | `3003`  | HTTP + Socket.io listen port               |
| `JWT_SECRET`    | yes      | —       | Must match `auth-service`                  |
| `KAFKA_BROKER`  | yes      | —       | Bootstrap server (e.g. `kafka:29092`)      |
| `DB_HOST`       | yes      | —       | PostgreSQL host                            |
| `DB_PORT`       | yes      | `5432`  | PostgreSQL port                            |
| `DB_USER`       | yes      | —       | PostgreSQL user                            |
| `DB_PASS`       | yes      | —       | PostgreSQL password                        |
| `DB_NAME`       | yes      | —       | PostgreSQL database                        |

## Running

### Inside the stack

```bash
docker compose up -d kitchen-service
```

This is one of two services with a host-port mapping (`3003:3003`) so KDS clients on the host can connect to Socket.io directly during development.

### Standalone

```bash
npm install
node src/index.js
```

Requires Postgres and Kafka to be reachable.

## Project Structure

```
src/
├── config/          # Postgres + Kafka clients
├── controllers/     # HTTP handlers
├── kafka/           # Consumer (orders) + producer (kitchen_*, alerts)
├── middlewares/
├── repositories/    # Task SQL access
├── routes/
├── socket/          # KDS socket namespace and broadcast helpers
└── index.js
```

## Notes

- All consumer offsets use a single consumer group; horizontal scaling requires partitioning the `orders` topic accordingly.
- Socket.io is broadcast-only from the server side — clients receive updates but do not push state.
