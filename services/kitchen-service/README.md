# Kitchen Service

## Overview
The **Kitchen Service** is responsible for managing kitchen operations in the IRMS system. It receives orders from the Ordering Service and communicates real-time status updates back to clients and other services.

## Technology Stack
- **Node.js** with **Express.js**
- **PostgreSQL** (`pg`) for database connections
- **KafkaJS** (`kafkajs`) for event-driven messaging and handling order events
- **Socket.io** (`socket.io`) for real-time web socket communication with front-end applications or kitchen display systems.

## Directory Structure
- `src/config/`: Configuration files for DB, Kafka, etc.
- `src/controllers/`: Request handlers
- `src/middlewares/`: Express middlewares
- `src/repositories/`: Database interaction layer
- `src/routes/`: Express route definitions
- `src/socket/`: Real-time socket event handlers
- `src/index.js`: Main application entry point

## Scripts
- `npm test`: Runs test suite (if present)

## Setup & Environment
Ensure you have a `.env` file in the root of the `kitchen-service` directory containing database credentials, Kafka broker URIs, and any relevant API secrets.
