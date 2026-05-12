# manager-dashboard

> Operator console for restaurant managers — Kitchen Display System (KDS), live order flow, sensor readings, alert feed, and analytics charts in a single React dashboard.

[![React](https://img.shields.io/badge/react-18-61DAFB?logo=react&logoColor=white)]()
[![Vite](https://img.shields.io/badge/vite-5-646CFF?logo=vite&logoColor=white)]()
[![Tailwind](https://img.shields.io/badge/tailwindcss-3-38B2AC?logo=tailwindcss&logoColor=white)]()
[![Dev Port](https://img.shields.io/badge/dev%20port-3001-blue)]()

## Overview

The manager-dashboard is the operational cockpit of the platform. It consolidates feeds from multiple backend services:

| Panel               | Source                                          | Transport             |
| ------------------- | ----------------------------------------------- | --------------------- |
| Kitchen Display     | [`kitchen-service`](../../services/kitchen-service/)     | Socket.io (`/socket.io`)        |
| Live analytics      | [`analytics-service`](../../services/analytics-service/) | Socket.io (`/analytics.io`)     |
| Order/menu admin    | [`ordering-service`](../../services/ordering-service/)   | REST via API gateway            |
| Inventory & alerts  | [`inventory-service`](../../services/inventory-service/), [`notification-service`](../../services/notification-service/) | REST via API gateway            |

## Tech Stack

- **Framework:** React 18
- **Build tool:** Vite 5 with `@` → `src/` alias
- **UI primitives:** Radix UI (dialog, dropdown, select, switch, scroll-area, toast, …)
- **Styling:** TailwindCSS 3 + `tailwindcss-animate`, `class-variance-authority`, `clsx`, `tailwind-merge`
- **Charts:** Recharts
- **Realtime:** `socket.io-client`
- **Misc:** `qrcode.react` (table QR generation), `lucide-react` (icons)

## Running

### Development (hot reload)

```bash
npm install
npm run dev
```

The Vite dev server runs on **http://localhost:3001** with the following proxies (see [`vite.config.js`](./vite.config.js)):

| Path             | Target                          | Notes                                  |
| ---------------- | ------------------------------- | -------------------------------------- |
| `/api/*`         | `http://localhost:8080`         | API gateway (Nginx)                    |
| `/uploads/*`     | `http://localhost:8080`         | Menu images                            |
| `/socket.io`     | `ws://localhost:3003`           | Kitchen Display System (Socket.io)     |
| `/analytics.io`  | `ws://localhost:3007/socket.io` | Live analytics (path-rewritten WS)     |

Make sure the backend stack is up:

```bash
make dev      # from repo root
```

### Production build

```bash
npm run build         # outputs to dist/
npm run preview       # serves the built bundle locally
```

### Container build

```bash
docker compose --profile frontend up -d manager-dashboard
# → http://localhost:3001
```

## Configuration

The dashboard's API and Socket targets are configured at build time through the dev-server proxy or the production Nginx config. No runtime environment variables are required.

## Project Structure

```
src/
├── components/      # UI components (KDS card, charts, alert feed, …)
├── pages/           # Route-level screens
├── hooks/           # useSocket, useAnalytics, etc.
├── lib/             # API client, formatters
├── App.jsx
└── main.jsx
```

## Notes

- Two **independent** Socket.io connections are opened on dashboard load: one to kitchen-service (KDS) and one to analytics-service (dashboard tiles). Keep this in mind when monitoring connection counts.
- Radix UI components are unstyled by design — styling is composed from Tailwind utility classes plus `class-variance-authority` recipes under `src/components/ui/`.
