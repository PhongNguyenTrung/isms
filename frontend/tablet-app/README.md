# tablet-app

> Customer-facing single-page application for in-restaurant ordering — runs on tablets mounted at each table or is accessed via QR code on a phone.

[![React](https://img.shields.io/badge/react-18-61DAFB?logo=react&logoColor=white)]()
[![Vite](https://img.shields.io/badge/vite-5-646CFF?logo=vite&logoColor=white)]()
[![Dev Port](https://img.shields.io/badge/dev%20port-3000-blue)]()

## Overview

The tablet-app is the customer's interface to the IRMS platform. Customers:

1. Open a URL or scan a table QR code.
2. Browse the live menu served by [`ordering-service`](../../services/ordering-service/).
3. Place orders that flow through Kafka into the kitchen.
4. Request the bill and trigger a payment workflow.

The app is intentionally minimal — React 18 with no state management library — to keep the surface small and the latency predictable on low-end tablet hardware.

## Tech Stack

- **Framework:** React 18
- **Build tool:** Vite 5
- **State:** Local component state (no Redux/Zustand)
- **HTTP:** Native `fetch`

## Running

### Development (hot reload)

```bash
npm install
npm run dev
```

The Vite dev server runs on **http://localhost:3000** and proxies `/api/*` and `/uploads/*` to the API gateway at `http://localhost:8080` (configured in [`vite.config.js`](./vite.config.js)). Make sure the backend stack is up:

```bash
make dev      # from repo root
```

### Production build

```bash
npm run build         # outputs to dist/
npm run preview       # serves the built bundle locally
```

### Container build

The provided [`Dockerfile`](./Dockerfile) produces an Nginx-served static bundle (port 80 inside the container, mapped to 3000 on the host by docker-compose):

```bash
docker compose --profile frontend up -d tablet-app
# → http://localhost:3000
```

## Configuration

The app reads its API base path from the dev-server proxy (development) or the Nginx config baked into the production image (production). No environment variables are required at build time.

## Project Structure

```
src/
├── components/      # Reusable UI pieces
├── pages/           # Top-level routes (menu, cart, checkout)
├── api/             # fetch wrappers around ordering-service endpoints
├── App.jsx
└── main.jsx
```

## Notes

- The dev proxy assumes the API gateway is available at `localhost:8080`. Adjust [`vite.config.js`](./vite.config.js) if your gateway runs elsewhere.
- Table identification is delivered through a token in the URL — see `ordering-service`'s `/api/table/resolve` endpoint for the contract.
