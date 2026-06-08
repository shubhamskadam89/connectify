# Local Development

## Environment

Copy the example environment file before running the app:

```bash
cp .env.example .env
```

The backend loads `.env` automatically from the repository root or the `backend` directory. The frontend uses `VITE_API_BASE_URL` from the same file when Vite starts.

Key variables:

| Variable | Purpose | Local default |
| --- | --- | --- |
| `DB_URL` | MySQL JDBC URL used by Spring Boot and Flyway | `jdbc:mysql://localhost:3306/connectify` |
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `root1234` |
| `CORS_ALLOWED_ORIGINS` | Frontend dev origins allowed by Spring CORS | `http://localhost:5173` |
| `VITE_API_BASE_URL` | Backend origin used by frontend API calls | `http://localhost:8080` |
| `JWT_SECRET` | Secret used to sign JWT access tokens | Change before shared environments |

## Database

Start a clean MySQL database:

```bash
docker compose -f infrastructure/docker-compose.yml up -d
```

Flyway runs automatically when the backend starts. Hibernate validates the schema, so schema changes should be committed as migrations under `backend/src/main/resources/db/migration`.

To reset local data during development:

```bash
docker compose -f infrastructure/docker-compose.yml down -v
docker compose -f infrastructure/docker-compose.yml up -d
```

## Backend

Run from the backend directory:

```bash
cd backend
./mvnw spring-boot:run
```

Run tests:

```bash
cd backend
./mvnw test
```

## Frontend

Install dependencies and start Vite:

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs on `http://localhost:5173` by default and calls the backend through `VITE_API_BASE_URL`.

## Testcontainers

DB-backed integration tests can extend `MysqlTestContainerSupport`. It starts a MySQL container, exposes Spring datasource properties, and keeps Flyway enabled so tests exercise committed migrations.
