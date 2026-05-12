# notification-service

> Outbound alerting — consumes the `alerts` topic and dispatches email notifications via SMTP, persisting a record of every send.

[![Port](https://img.shields.io/badge/port-3006-blue)]()
[![Node](https://img.shields.io/badge/node-20+-339933)]()
[![SMTP](https://img.shields.io/badge/transport-SMTP-005FAD)]()

## Overview

A small, focused service whose only job is to turn Kafka alert events into delivered notifications:

1. **Consume `alerts`** (low stock, temperature breach, kitchen overload, …).
2. **Format** a human-readable message based on alert type.
3. **Send** via SMTP using `nodemailer`. In dev mode (no SMTP config), falls back to [Ethereal](https://ethereal.email) so messages can be previewed in the browser.
4. **Persist** the dispatched notification in PostgreSQL for audit/history.
5. **Expose** a read API so the manager dashboard can render a notification feed.

## Tech Stack

- **Runtime:** Node.js 20+, Express 5
- **Persistence:** PostgreSQL (`pg`)
- **Messaging:** KafkaJS (consumer)
- **Transport:** `nodemailer` (SMTP)

## API

| Method | Path                  | Description                              |
| ------ | --------------------- | ---------------------------------------- |
| `GET`  | `/api/notifications/` | Paginated list of recent notifications   |
| `GET`  | `/health`             | Liveness probe                           |

## Events

| Direction | Topic    | Purpose                                          |
| --------- | -------- | ------------------------------------------------ |
| Consumes  | `alerts` | All operational alerts from across the platform  |

## Configuration

| Variable        | Required | Default                              | Description                                |
| --------------- | -------- | ------------------------------------ | ------------------------------------------ |
| `PORT`          | no       | `3006`                               | HTTP listen port                           |
| `KAFKA_BROKERS` | yes      | —                                    | Comma-separated bootstrap servers          |
| `DB_HOST`       | yes      | —                                    | PostgreSQL host                            |
| `DB_PORT`       | yes      | `5432`                               | PostgreSQL port                            |
| `DB_USER`       | yes      | —                                    | PostgreSQL user                            |
| `DB_PASSWORD`   | yes      | —                                    | PostgreSQL password                        |
| `DB_NAME`       | yes      | —                                    | PostgreSQL database                        |
| `SMTP_HOST`     | no       | *(empty → Ethereal dev account)*     | SMTP server hostname                       |
| `SMTP_PORT`     | no       | `587`                                | SMTP server port                           |
| `SMTP_USER`     | no       | —                                    | SMTP auth username                         |
| `SMTP_PASS`     | no       | —                                    | SMTP auth password                         |
| `SMTP_FROM`     | no       | `IRMS Alerts <alerts@irms.local>`    | Envelope `From` address                    |

## Running

### Inside the stack

```bash
docker compose up -d notification-service
```

The compose file leaves SMTP variables blank, so a development run auto-provisions an Ethereal mailbox. The preview URL is logged on startup.

### Standalone

```bash
npm install
npm run dev    # nodemon
# or
npm start
```

## Project Structure

```
src/
├── config/          # Postgres, Kafka, mail transport
├── consumers/       # alerts consumer
├── dispatchers/     # SMTP send + persistence
├── controllers/     # HTTP read endpoint
├── repositories/    # Notification SQL access
├── routes/
└── index.js
```

## Notes

- The service does **not** generate alerts itself — it is a sink. Producers of `alerts` (kitchen-service, inventory-service) own the alert taxonomy.
- For production, supply real SMTP credentials via `SMTP_*` env vars. Ethereal is for development convenience only.
