# Auth Service

## Overview
The **Auth Service** is responsible for User & Access Management within the IRMS system. It provides authentication and authorization functionality to secure endpoints, manage user sessions, and handle user credentials.

## Technology Stack
- **Node.js** with **Express.js**
- **PostgreSQL** (`pg`) for database connections
- **JSON Web Tokens (JWT)** (`jsonwebtoken`) for stateless authentication
- **Bcrypt** (`bcryptjs`) for password hashing

## Directory Structure
- `src/config/`: Configuration files (e.g., database connection)
- `src/controllers/`: Request handlers and business logic mapping
- `src/middlewares/`: Express middlewares (e.g., authentication check)
- `src/models/`: Database schema definitions (if applicable)
- `src/repositories/`: Database interaction layer
- `src/routes/`: Express route definitions
- `src/index.js`: Main application entry point

## Scripts
- `npm start`: Starts the server in production mode.
- `npm run dev`: Starts the server in watch mode using nodemon.

## Setup & Environment
Ensure you have a `.env` file in the root of the `auth-service` directory with the required variables, such as your authentication secret and database connection string.
