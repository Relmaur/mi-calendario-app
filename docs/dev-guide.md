# Development Guide

## Prerequisites

| Tool | Min version | Notes |
|---|---|---|
| Node.js | 20 | Required for local dev without Docker |
| npm | 10 | Ships with Node 20 |
| Docker Desktop | 4.x | Required for containerized dev/prod |

## First-time setup

### 1. Backend secrets

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and replace the placeholder secrets with real values. To generate cryptographically strong secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run that twice — once for `ACCESS_TOKEN_SECRET` and once for `REFRESH_TOKEN_SECRET`.

### 2. Install dependencies (local dev)

```bash
# From repo root — installs all workspaces
npm install
```

### 3. Set up the database (local dev only)

```bash
cd backend
npx prisma db push      # creates/syncs app.db from schema.prisma
```

## Running locally (no Docker)

```bash
# From repo root — starts backend and frontend concurrently
npm run dev
```

Or run them individually in separate terminals:

```bash
npm run dev:backend     # Node.js API on http://localhost:4001
npm run dev:frontend    # Vite dev server on http://localhost:5173
```

The `userWeek` store hot-reloads as you edit `.vue` files. Backend hot-reloads on `.js` changes via nodemon.

## Running with Docker (recommended)

```bash
# Build images and start services (first run takes a minute to build)
docker compose up --build

# Subsequent starts (no code changes requiring rebuild)
docker compose up

# Stop
docker compose down
```

Services:
- Frontend (Vite HMR): http://localhost:5173
- Backend (GraphQL): http://localhost:4001/graphql

### How hot-reload works in Docker

The compose file bind-mounts your source directories into the containers:

```
./backend/src    → /app/src   (nodemon watches this)
./frontend/src   → /app/src   (Vite watches this for HMR)
```

`node_modules` is **not** bind-mounted — it stays inside the image layer. This means:

- Editing source files triggers hot reload immediately.
- **Adding/removing npm packages requires a rebuild**: `docker compose up --build`.

### Database persistence

The SQLite database file is bind-mounted:

```
./backend/src/database  → /app/src/database
```

So `app.db` lives on your host and survives container restarts.

If you need to reset the database:

```bash
rm backend/src/database/app.db
docker compose up --build
# The Prisma client will create a fresh db.db on next start
```

To run Prisma migrations or push schema changes:

```bash
docker compose exec backend npx prisma db push
```

## Production build

### Environment

Create a root `.env` file (see `.env.example`) with the production URLs:

```env
VITE_GRAPHQL_URL=https://api.your-domain.com/graphql
VITE_LOGIN_URL=https://your-domain.com/login
```

These are injected as Docker build args and baked into the frontend JS bundle at build time.

### Build and run

```bash
docker compose -f docker-compose.prod.yml up --build
```

This:
1. Builds the backend Node image (production target — no nodemon, source included in image).
2. Builds the frontend in a multi-stage build: Vite compiles static assets, then Nginx serves them.
3. Exposes the frontend on port 80.

### Deploying to a server

The production compose file is self-contained. On your server:

```bash
git clone <repo-url>
cd mi-calendario-app
cp backend/.env.example backend/.env   # fill in secrets
cp .env.example .env                    # fill in VITE_* URLs
docker compose -f docker-compose.prod.yml up -d --build
```

## Adding a package

Since this is an npm workspace monorepo, always specify which workspace:

```bash
# Add to backend
npm install <package> -w backend

# Add to frontend
npm install <package> -w frontend

# Add a dev dependency to the root (e.g., a monorepo tool)
npm install --save-dev <package>
```

Then rebuild the Docker image for the affected service:

```bash
docker compose up --build backend    # or frontend
```

## Prisma workflow

```bash
# After editing prisma/schema.prisma — push to dev db
cd backend && npx prisma db push

# Generate updated Prisma client after schema changes
cd backend && npx prisma generate

# Open Prisma Studio (database GUI)
cd backend && npx prisma studio
```

## GraphQL playground

Apollo Server's built-in playground is available at:

```
http://localhost:4001/graphql
```

Example: register a user

```graphql
mutation {
  register(email: "test@example.com", password: "password123") {
    accessToken
    refreshToken
    user {
      id
      email
    }
  }
}
```

Example: fetch user with schedules

```graphql
query {
  user(id: "1") {
    id
    email
    schedules {
      id
      title
      week
    }
  }
}
```

## Troubleshooting

**Port already in use**

```bash
lsof -i :4001   # find what's using the port
lsof -i :5173
```

**`node_modules` mismatch after pulling changes**

```bash
docker compose down
docker compose up --build
```

**Prisma client out of sync**

```bash
cd backend && npx prisma generate
```

Or inside Docker:

```bash
docker compose exec backend npx prisma generate
```

**SQLite database locked**

Only one process can write to SQLite at a time. If you see `SQLITE_BUSY`, stop any other processes connecting to `app.db` (e.g., Prisma Studio).
