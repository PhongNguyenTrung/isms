# ordering-service

> Customer-facing order lifecycle: menu management, table-session resolution, order placement, billing, and payment requests.

[![Port](https://img.shields.io/badge/port-3002-blue)]()
[![Node](https://img.shields.io/badge/node-20+-339933)]()
[![Kafka](https://img.shields.io/badge/kafka-producer%20%2B%20consumer-orange)]()

## Overview

This service is the entry point for every customer interaction:

- A diner scans a table QR code → `/api/table` resolves a session.
- The tablet app fetches the menu via `/api/menu`.
- An order is placed through `/api/orders` and published to Kafka topic **`orders`**.
- The kitchen acknowledges via the **`kitchen_ready`** topic, which this service consumes to update order state.

## Tech Stack

- **Runtime:** Node.js 20+, Express 5
- **Persistence:** PostgreSQL (`pg`)
- **Messaging:** KafkaJS (producer + consumer)
- **Auth:** `jsonwebtoken` (validates tokens minted by `auth-service`)
- **Uploads:** `multer` (menu images persisted under `/uploads`)

## API

| Resource         | Method   | Path                                              | Description                                  |
| ---------------- | -------- | ------------------------------------------------- | -------------------------------------------- |
| **Menu**         | `GET`    | `/api/menu`                                       | List published menu items                    |
|                  | `GET`    | `/api/menu/admin/all`                             | List all items (admin)                       |
|                  | `GET`    | `/api/menu/:id`                                   | Fetch a menu item                            |
|                  | `POST`   | `/api/menu`                                       | Create a menu item                           |
|                  | `POST`   | `/api/menu/upload`                                | Upload a menu image                          |
|                  | `PUT`    | `/api/menu/:id`                                   | Update a menu item                           |
|                  | `DELETE` | `/api/menu/:id`                                   | Delete a menu item                           |
| **Orders**       | `POST`   | `/api/orders`                                     | Place a new order                            |
|                  | `GET`    | `/api/orders/active`                              | List orders in progress                      |
|                  | `GET`    | `/api/orders/active-tables`                       | List tables with open orders                 |
|                  | `GET`    | `/api/orders/:id`                                 | Fetch an order                               |
|                  | `PATCH`  | `/api/orders/:id/confirm`                         | Confirm pending order                        |
|                  | `PATCH`  | `/api/orders/:id/cancel`                          | Cancel order                                 |
| **Billing**      | `GET`    | `/api/orders/table/:tableId`                      | Active order for a table                     |
|                  | `GET`    | `/api/orders/table/:tableId/bill`                 | Bill summary for a table                     |
|                  | `POST`   | `/api/orders/table/:tableId/request-payment`      | Customer requests payment                    |
|                  | `POST`   | `/api/orders/table/:tableId/complete-payment`     | Staff completes payment                      |
| **Tables**       | `GET`    | `/api/table/resolve`                              | Resolve a table from a QR token              |
|                  | `POST`   | `/api/table/sessions`                             | Open a table session                         |
|                  | `GET`    | `/api/table/active-token/:tableId`                | Fetch the active token for a table           |
| **Static**       | `GET`    | `/uploads/*`                                      | Served menu images                           |
| **Health**       | `GET`    | `/health`                                         | Liveness probe                               |

## Events

| Direction   | Topic            | Purpose                                              |
| ----------- | ---------------- | ---------------------------------------------------- |
| Produces    | `orders`         | New order placed; consumed by kitchen and analytics  |
| Consumes    | `kitchen_ready`  | Ticket marked ready; updates order status            |

## Configuration

| Variable        | Required | Default | Description                                   |
| --------------- | -------- | ------- | --------------------------------------------- |
| `PORT`          | no       | `3002`  | HTTP listen port                              |
| `JWT_SECRET`    | yes      | —       | Must match `auth-service`                     |
| `KAFKA_BROKER`  | yes      | —       | Bootstrap server (e.g. `kafka:29092`)         |
| `DB_HOST`       | yes      | —       | PostgreSQL host                               |
| `DB_PORT`       | yes      | `5432`  | PostgreSQL port                               |
| `DB_USER`       | yes      | —       | PostgreSQL user                               |
| `DB_PASS`       | yes      | —       | PostgreSQL password                           |
| `DB_NAME`       | yes      | —       | PostgreSQL database                           |

## Running

### Inside the stack

```bash
docker compose up -d ordering-service
```

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
├── controllers/     # HTTP handlers (menu, order, table)
├── kafka/           # Producer / consumer setup
├── middlewares/     # JWT extraction
├── repositories/    # SQL access
├── routes/          # Express route mounts
└── index.js
```

## Notes

- Uploaded menu images live in a named Docker volume (`menu_uploads`) at `/usr/src/app/uploads` and are served on `/uploads/*`.
- Order state transitions are *event-driven*: status changes happen in response to Kafka messages, not direct HTTP calls between services.
