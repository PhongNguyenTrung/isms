# iot-gateway

> Bridge between the field MQTT broker and the Kafka event backbone — subscribes to `sensors/+/+` topics from Mosquitto and republishes normalized telemetry to `sensor.telemetry`.

[![Port](https://img.shields.io/badge/port-3004-blue)]()
[![Node](https://img.shields.io/badge/node-20+-339933)]()
[![MQTT](https://img.shields.io/badge/mqtt-3.1.1-660066)]()

## Overview

IoT devices (load cells in ingredient bins, temperature probes in refrigerators) publish to MQTT topics. The gateway is a thin, stateless adapter that:

1. Subscribes to all sensor topics on the Mosquitto broker.
2. Parses the JSON payload, attaches a normalized envelope (sensor id, type, timestamp).
3. Publishes the message to Kafka topic **`sensor.telemetry`** for the inventory-service to ingest.

This isolates the MQTT/IoT layer from the rest of the platform — downstream services only know Kafka.

## Tech Stack

- **Runtime:** Node.js 20+, Express 5
- **MQTT client:** `mqtt` 5.x
- **Messaging:** KafkaJS (producer only)

## API

| Method | Path      | Description                            |
| ------ | --------- | -------------------------------------- |
| `GET`  | `/health` | Liveness probe (MQTT + Kafka status)   |

The gateway has no business endpoints — its work happens on the message-bus layer.

## Topics

### MQTT (subscribed)

```
sensors/{location}-{sensorId}/{kind}
```

Example: `sensors/LOC1-WGT1/weight`, `sensors/LOC2-TMP1/temperature`.

Payload format:

```json
{ "value": 8.5, "unit": "kg", "timestamp": "2026-05-12T10:30:00.000Z" }
```

### Kafka (produced)

| Topic               | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `sensor.telemetry`  | One message per MQTT publication, after normalization |

## Configuration

| Variable        | Required | Default                  | Description                              |
| --------------- | -------- | ------------------------ | ---------------------------------------- |
| `PORT`          | no       | `3004`                   | HTTP listen port (health only)           |
| `MQTT_BROKER`   | yes      | `mqtt://localhost:1883`  | MQTT broker URL                          |
| `KAFKA_BROKERS` | yes      | —                        | Comma-separated bootstrap servers        |

## Running

### Inside the stack

```bash
docker compose up -d iot-gateway
```

Mosquitto and Kafka are brought up automatically as dependencies.

### Standalone

```bash
npm install
node src/index.js
```

### Generating synthetic traffic

The repository ships with a simulator at [`scripts/simulate-iot.js`](../../scripts/simulate-iot.js):

```bash
node scripts/simulate-iot.js              # one-shot scenario set
node scripts/simulate-iot.js --continuous # loop every 5 s
```

## Project Structure

```
src/
├── config/          # MQTT + Kafka client setup
├── handlers/        # MQTT message → Kafka publish pipeline
└── index.js
```

## Notes

- The gateway is **at-least-once**: a publish failure to Kafka does not ack to MQTT, so the broker will redeliver.
- It maintains no local state — restart safely at any time.
