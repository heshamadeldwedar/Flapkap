# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS v11.0.1 application with PostgreSQL database using Sequelize ORM v6.37.7. The project is configured for both development and production environments using Docker.

## Development Commands

- **Start development server**: `npm run start:dev`
- **Start production server**: `npm run start:prod`
- **Build for production**: `npm run build`
- **Run unit tests**: `npm test`
- **Run tests in watch mode**: `npm run test:watch`
- **Run test coverage**: `npm run test:cov`
- **Run e2e tests**: `npm run test:e2e`
- **Lint and fix code**: `npm run lint`
- **Format code**: `npm run format`

## Docker Commands

- **Start development environment**: `docker-compose up`
- **Start in detached mode**: `docker-compose up -d`
- **Build production image**: `docker build -t flapkap .`
- **Stop all containers**: `docker-compose down`
- **View logs**: `docker-compose logs -f`

## Container Execution

**IMPORTANT**: All application commands (npm, sequelize-cli, etc.) must be executed inside the app container:

- **Execute commands in app container**: `docker-compose exec app-1 <command>`
- **Interactive shell in app container**: `docker-compose exec app-1 /bin/sh`
- **Example - Install packages**: `docker-compose exec app-1 npm install <package>`
- **Example - Run migrations**: `docker-compose exec app-1 npx sequelize-cli db:migrate`
- **Example - Generate migration**: `docker-compose exec app-1 npx sequelize-cli migration:generate --name <migration-name>`

## Technology Stack

- **Framework**: NestJS v11.0.1
- **Node.js**: v22.17.1 (LTS)
- **Database**: PostgreSQL 16-alpine
- **ORM**: Sequelize v6.37.7 with sequelize-typescript v2.1.6
- **Testing**: Jest v29.7.0 with Supertest v7.0.0
- **Linting**: ESLint v9.18.0 with Prettier v3.4.2
- **TypeScript**: v5.7.3
- **Package Manager**: npm v10.9.2

## Architecture Overview

- **Entry Point**: `src/main.ts` - Application bootstrap
- **Root Module**: `src/app.module.ts` - Main application module
- **Controller**: `src/app.controller.ts` - Basic HTTP endpoints
- **Service**: `src/app.service.ts` - Business logic layer

## Database Configuration

- **Development Database**: PostgreSQL container via docker-compose
- **Connection String**: `postgresql://postgres:password@postgres:5432/flapkap`
- **Database Name**: `flapkap`
- **Port**: 5432 (exposed to host)
- **User**: `postgres`
- **Password**: `password`

## Docker Configuration

- **Dockerfile**: Multi-stage production build with Node.js Alpine
- **Dockerfile.dev**: Development container that mounts source code
- **docker-compose.yml**: Development environment with PostgreSQL service
- **Volumes**: Code mounted at `/app`, `node_modules` volume for performance

## Authentication & Authorization

The system uses JWT-based authentication with role-based access control:

- **Roles**: Role 1 (buyer) and Role 2 (seller) - each user has one role_id
- **JWT Secret**: Set `JWT_SECRET` environment variable
- **Token Expiry**: Configurable via `JWT_EXPIRES_IN` (default: 24h)

### Authentication Endpoints

- **POST /auth/register** - Register new user with role_id (1 for buyer, 2 for seller)
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "role_id": 1
  }
  ```
- **POST /auth/login** - Login and get JWT token
  ```json
  {
    "email": "user@example.com", 
    "password": "password123"
  }
  ```
- **GET /auth/profile** - Get current user profile (protected)
- **GET /auth/seller-only** - Seller-only endpoint (protected)
- **GET /auth/buyer-only** - Buyer-only endpoint (protected)

### Database Schema

- **users**: id, email, password, role_id, created_at, updated_at
- **roles**: id (1=buyer, 2=seller), name, description, created_at
- **Relationship**: users.role_id → roles.id (one-to-many)

### Database Migrations

- **Run migrations**: `docker exec flapkap-app-1 npx sequelize-cli db:migrate`
- **Create migration**: `docker exec flapkap-app-1 npx sequelize-cli migration:generate --name <name>`

### Project Structure

The project follows a **layered architecture** with domain-driven design:

```
src/
├── auth/                    # Authentication domain
│   ├── controllers/        # Auth HTTP controllers
│   │   └── auth.controller.ts
│   ├── services/           # Auth business logic
│   │   └── auth.service.ts
│   ├── dto/                # Data transfer objects
│   ├── guards/             # JWT and role guards
│   ├── strategies/         # JWT passport strategy
│   └── decorators/         # Role decorator
├── users/                   # User management domain
│   ├── controllers/        # User HTTP controllers
│   │   └── users.controller.ts
│   ├── services/           # User business logic
│   │   └── users.service.ts
│   ├── repositories/       # Database access layer
│   │   ├── user.repository.ts
│   │   └── role.repository.ts
│   ├── dto/                # User DTOs
│   └── interfaces/         # User interfaces
├── database/               # Database configuration
│   ├── models/             # Sequelize models
│   ├── migrations/         # Database migrations
│   └── config.js           # Database configuration
└── main.ts                 # Application entry point
```

### Architecture Layers

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Contain business logic and orchestrate operations
3. **Repositories**: Handle database operations and data access
4. **Models**: Define database entities and relationships

### Available Endpoints

**Authentication Endpoints:**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)
- `GET /auth/seller-only` - Seller-only test endpoint
- `GET /auth/buyer-only` - Buyer-only test endpoint

**User Management Endpoints:**
- `GET /users` - Get all users (seller only)
- `GET /users/:id` - Get user by ID (authenticated)
- `PUT /users/:id` - Update user (seller only)
- `DELETE /users/:id` - Delete user (seller only)