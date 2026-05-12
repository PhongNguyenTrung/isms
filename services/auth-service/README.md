# auth-service

> Authentication and authorization for the IRMS platform — issues JWTs, manages user accounts, and exposes a `/me` endpoint for current-user resolution.

[![Port](https://img.shields.io/badge/port-3001-blue)]()
[![Node](https://img.shields.io/badge/node-20+-339933)]()
[![Express](https://img.shields.io/badge/express-5.x-000000)]()

## Overview

The auth-service is the **only** writer to the `users` table and the sole issuer of access/refresh tokens. Other services trust JWTs signed with the shared `JWT_SECRET` and decode them locally; there is no central session store.

## Tech Stack

- **Runtime:** Node.js 20+, Express 5
- **Persistence:** PostgreSQL (via `pg`)
- **Auth:** `jsonwebtoken` (HS256), `bcryptjs` (password hashing)
- **CORS:** `cors`

## API

Base path: `/api/auth` (also reachable via the API gateway).

| Method | Path        | Auth        | Description                                       |
| ------ | ----------- | ----------- | ------------------------------------------------- |
| `POST` | `/register` | Public      | Create a new user account                         |
| `POST` | `/login`    | Public      | Exchange credentials for access + refresh tokens  |
| `POST` | `/refresh`  | Public      | Exchange a valid refresh token for a new access token |
| `GET`  | `/me`       | Bearer JWT  | Return the current authenticated user             |
| `GET`  | `/health`   | Public      | Liveness probe                                    |

## Configuration

| Variable      | Required | Default | Description                          |
| ------------- | -------- | ------- | ------------------------------------ |
| `PORT`        | no       | `3001`  | HTTP listen port                     |
| `JWT_SECRET`  | **yes**  | —       | Symmetric signing secret (≥ 32 bytes)|
| `DB_HOST`     | yes      | —       | PostgreSQL host                      |
| `DB_PORT`     | yes      | `5432`  | PostgreSQL port                      |
| `DB_USER`     | yes      | —       | PostgreSQL user                      |
| `DB_PASS`     | yes      | —       | PostgreSQL password                  |
| `DB_NAME`     | yes      | —       | PostgreSQL database                  |

A working set is wired in [`docker-compose.yml`](../../docker-compose.yml). For local development, create a `.env` file in this directory mirroring those values.

## Running

### Inside the stack (recommended)

```bash
docker compose up -d auth-service
```

### Standalone

```bash
npm install
npm run dev     # nodemon, auto-reload
# or
npm start       # production
```

## Project Structure

```
src/
├── config/          # Database client
├── controllers/     # Request handlers
├── middlewares/     # JWT verification
├── repositories/    # SQL access layer
├── routes/          # Express route mounts
└── index.js         # App bootstrap
```

## Notes

- The service is intentionally stateless — horizontal scaling requires only that all replicas share the same `JWT_SECRET`.
- Token payload includes `user_id` and `role`; downstream services must enforce role checks themselves.
