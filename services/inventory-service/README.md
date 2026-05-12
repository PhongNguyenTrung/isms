# inventory-service

> Time-series store and threshold engine for IoT telemetry — persists every sensor reading to InfluxDB and emits operational alerts on low stock or temperature breach.

[![Port](https://img.shields.io/badge/port-3005-blue)]()
[![Node](https://img.shields.io/badge/node-20+-339933)]()
[![InfluxDB](https://img.shields.io/badge/influxdb-2.7-22ADF6?logo=influxdb&logoColor=white)]()

## Overview

Sits at the receiving end of the IoT pipeline:

```
sensors → mosquitto → iot-gateway → kafka(sensor.telemetry) → inventory-service → InfluxDB
                                                                    │
                                                                    └─→ kafka(alerts) → notification-service
```

- **Writes** every reading to InfluxDB (bucket `irms_bucket`).
- **Evaluates thresholds** per sensor type (configurable defaults: weight < 10 kg, temperature > 6 °C).
- **Emits `alerts`** to Kafka when a threshold is crossed.
- **Exposes a query API** so the manager dashboard can pull current sensor state.

## Tech Stack

- **Runtime:** Node.js 20+, Express 5
- **Time-series store:** InfluxDB 2.7 (`@influxdata/influxdb-client`)
- **Messaging:** KafkaJS (consumer + producer)

## API

| Method | Path                                  | Description                              |
| ------ | ------------------------------------- | ---------------------------------------- |
| `GET`  | `/api/inventory/sensors/:sensorId`    | Recent readings for a single sensor      |
| `GET`  | `/api/inventory/status`               | Aggregated snapshot of every known sensor |
| `GET`  | `/health`                             | Liveness probe                           |

## Events

| Direction | Topic               | Purpose                                       |
| --------- | ------------------- | --------------------------------------------- |
| Consumes  | `sensor.telemetry`  | Persists reading, evaluates thresholds        |
| Produces  | `alerts`            | Low stock, temperature breach                 |

## Configuration

| Variable           | Required | Default | Description                              |
| ------------------ | -------- | ------- | ---------------------------------------- |
| `PORT`             | no       | `3005`  | HTTP listen port                         |
| `KAFKA_BROKERS`    | yes      | —       | Comma-separated bootstrap servers        |
| `INFLUXDB_URL`     | yes      | —       | e.g. `http://influxdb:8086`              |
| `INFLUXDB_TOKEN`   | yes      | —       | Admin/write token                        |
| `INFLUXDB_ORG`     | yes      | —       | InfluxDB organization                    |
| `INFLUXDB_BUCKET`  | yes      | —       | Target bucket for sensor data            |

## Running

### Inside the stack

```bash
docker compose up -d inventory-service
```

### Standalone

```bash
npm install
node src/index.js
```

Requires Kafka and InfluxDB to be reachable.

## Project Structure

```
src/
├── config/          # InfluxDB + Kafka clients
├── consumers/       # sensor.telemetry consumer + threshold logic
├── controllers/     # HTTP read endpoints
├── repositories/    # Influx query helpers
├── routes/
└── index.js
```

## Notes

- The service writes one InfluxDB point per consumed message; field cardinality is bounded by `sensor_id` + `kind`.
- Alert deduplication is **not** performed here — `notification-service` is responsible for rate-limiting outbound messages.
