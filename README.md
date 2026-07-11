# Booking Platform API

A REST API for managing bookable services and customer bookings, built with NestJS, TypeScript, TypeORM, and PostgreSQL. Staff authenticate with JWT to manage services and bookings; customers create bookings without an account.

## Architecture

The application follows a thin controller flow: Controller -> Service -> Repository -> Database.

- **Modules**: `auth`, `services`, `bookings`, plus shared infrastructure under `common` and database wiring under `database`.
- **DTOs**: every endpoint exposes explicit request and response DTOs; controllers never return TypeORM entities.
- **Validation**: a global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`) validates request DTOs. Cross-record and status-transition rules live in the services.
- **Errors**: a global exception filter returns a consistent payload of `{ statusCode, message, traceId }`, adding field-level `errors` for validation failures.
- **Persistence**: PostgreSQL via TypeORM with `synchronize: false`; the schema is managed entirely through migration files.

## Prerequisites

- Node.js 20+ and npm
- Docker and Docker Compose (for the PostgreSQL database)

## Installation

```bash
npm install
```

## Environment variables

Copy the example file to an ignored `.env` before running anything:

```bash
cp .env.example .env
```

| Variable            | Description                       | Example                     |
| ------------------- | --------------------------------- | --------------------------- |
| `PORT`              | HTTP port the API listens on      | `3000`                      |
| `DATABASE_HOST`     | PostgreSQL host                   | `localhost`                 |
| `DATABASE_PORT`     | PostgreSQL port                   | `5432`                      |
| `DATABASE_NAME`     | Database name                     | `booking_platform`          |
| `DATABASE_USER`     | Database user                     | `postgres`                  |
| `DATABASE_PASSWORD` | Database password                 | `postgres`                  |
| `JWT_SECRET`        | Secret used to sign access tokens | `replace-with-a-secure-...` |
| `JWT_EXPIRES_IN`    | Access-token lifetime             | `1h`                        |

## Database setup

Start PostgreSQL in Docker (values are read from `.env`):

```bash
docker compose up -d
```

Apply the migrations against the running database:

```bash
npm run migration:run
```

Other migration commands:

```bash
npm run migration:generate -- src/database/migrations/<Name>
npm run migration:revert
npm run migration:show
```

## Running the API

```bash
npm run start:dev          # watch mode
npm run start              # one-off
npm run build && npm run start:prod
```

The API is served under the global `/api` prefix, for example `http://localhost:3000/api/services`.

## Tests

```bash
npm test         # unit tests
npm run test:e2e # e2e smoke suite
npm run lint     # eslint
```

## API documentation

Swagger UI is available at `http://localhost:3000/api/docs` with bearer-token support for the protected routes.

## Endpoints

All routes are prefixed with `/api`. Service management and booking reads require a bearer token; registration, login, and booking creation are public.

| Method | Path                   | Auth   | Description                                     |
| ------ | ---------------------- | ------ | ---------------------------------------------- |
| POST   | `/auth/register`       | Public | Register a staff user, returns an access token |
| POST   | `/auth/login`          | Public | Log in, returns an access token                |
| POST   | `/services`            | JWT    | Create a service                               |
| GET    | `/services`            | JWT    | List services                                  |
| GET    | `/services/:id`        | JWT    | Get one service                                |
| PATCH  | `/services/:id`        | JWT    | Update a service                               |
| DELETE | `/services/:id`        | JWT    | Delete a service                               |
| POST   | `/bookings`            | Public | Create a booking                               |
| GET    | `/bookings`            | JWT    | List bookings (paginated, searchable)          |
| GET    | `/bookings/:id`        | JWT    | Get one booking                                |
| PATCH  | `/bookings/:id/status` | JWT    | Change a booking's status                      |
| PATCH  | `/bookings/:id/cancel` | JWT    | Cancel a booking                               |

`GET /bookings` accepts `page` (default 1), `limit` (default 20, max 100), `search` (matches customer name, email, or phone), and `status` (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`). It returns `{ items, page, limit, total }`.

## API examples

Register and capture a token:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"secure-password"}'
```

Create a service (authenticated):

```bash
curl -X POST http://localhost:3000/api/services \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{"title":"Haircut","description":"Standard haircut","duration":30,"price":25}'
```

Create a public booking:

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H 'Content-Type: application/json' \
  -d '{"customerName":"Jane Doe","customerEmail":"jane@example.com","customerPhone":"+1-555-0100","serviceId":"<service-id>","bookingDate":"2026-08-01","bookingTime":"14:30"}'
```

Cancel a booking (authenticated):

```bash
curl -X PATCH http://localhost:3000/api/bookings/<booking-id>/cancel \
  -H 'Authorization: Bearer <token>'
```

## Business rules

- New bookings start as `PENDING`.
- A booking references an existing service; a missing service returns 404 and an inactive service returns 409.
- Booking dates cannot be in the past (400).
- A service, date, and time slot cannot hold more than one non-cancelled booking (409).
- Status transitions are validated; `CANCELLED` and `COMPLETED` are terminal, so a cancelled booking cannot become completed (409).

## Assumptions

- Dates are supplied as `YYYY-MM-DD` and times as 24-hour `HH:mm` (or `HH:mm:ss`), interpreted in the server's timezone.
- Only staff users created through registration manage services and read bookings.
- Inactive services cannot receive new bookings.
- Duplicate prevention applies to non-cancelled bookings only.
- No availability or capacity model exists beyond single-slot duplicate prevention.
- Refresh tokens are out of scope; only short-lived access tokens are issued.

## Future improvements

- Role-based access control to separate staff from administrators.
- Configurable service availability and capacity windows.
- Refresh-token rotation and token revocation.
- Booking reminders and customer notifications.
