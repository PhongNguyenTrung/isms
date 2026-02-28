# Ordering Service

## Overview
The **Ordering Service** manages the lifecycle of customer orders in the IRMS system. It handles order creation, validation, and communicates with other services like the Kitchen Service to process those orders.

## Technology Stack
- **Node.js** with **Express.js**
- **PostgreSQL** (`pg`) for database connections
- **KafkaJS** (`kafkajs`) for asynchronous event-driven communication (e.g., publishing `OrderCreated` events)
- **JSON Web Tokens (JWT)** (`jsonwebtoken`) for verifying authenticated requests.

## Directory Structure
- `src/config/`: Configuration files (e.g., DB connection, Kafka setup)
- `src/controllers/`: Request handlers for REST API endpoints
- `src/middlewares/`: Express middlewares (e.g., auth extraction)
- `src/repositories/`: Database interaction layer for storing orders
- `src/routes/`: Express route definitions
- `src/index.js`: Main application entry point

## Scripts
- `npm test`: Runs test suite (if present)

## Setup & Environment
Ensure you have a `.env` file in the root of the `ordering-service` directory to define essential environment variables such as database connection parameters, JWT secrets, and Kafka broker URLs.
