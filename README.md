# Mi Calendario

A personal scheduling web application. Users can create weekly schedules, manage subjects per day, and organize their time visually.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3, Vite, Apollo Client (GraphQL), Pinia, PrimeVue, Tailwind CSS, SCSS |
| Backend | Node.js (CommonJS), Express, Apollo Server, Prisma ORM |
| Database | SQLite (dev) |
| Auth | JWT — access token (15 min) + refresh token (7 days), stored as cookies |
| Container | Docker + Docker Compose |

## Repository structure

```
mi-calendario-app/          ← monorepo root
├── backend/                ← Node.js GraphQL API
│   ├── src/
│   │   ├── api/
│   │   │   ├── schema/     ← GraphQL type definitions
│   │   │   └── resolvers/  ← GraphQL resolvers
│   │   ├── database/       ← Prisma client singleton + SQLite file
│   │   └── app.js          ← Express server entry point
│   ├── prisma/
│   │   └── schema.prisma   ← Data models (User, Schedule)
│   └── Dockerfile
├── frontend/               ← Vue 3 SPA
│   ├── src/
│   │   ├── views/          ← Page-level components (Home, Settings)
│   │   ├── layouts/        ← Shell layout (LeftSide, RightSide, AppHeader…)
│   │   ├── components/     ← Reusable components (popups, subject card…)
│   │   ├── store/          ← Pinia stores (mainApp, userWeek, popups, cookies)
│   │   ├── router/         ← Vue Router (auth guards)
│   │   ├── styles/         ← Global SCSS (variables, reset, component styles)
│   │   └── apolloClient.js ← Apollo Client setup
│   ├── nginx.conf          ← Nginx config for production container
│   └── Dockerfile
├── docs/
│   ├── architecture.md     ← System design and data flow
│   └── dev-guide.md        ← Local and Docker development guide
├── CLAUDE.md               ← Context for AI coding assistants
├── docker-compose.yml      ← Dev environment
├── docker-compose.prod.yml ← Production environment
└── package.json            ← npm workspaces root
```

## Quick start (Docker)

> Requires Docker Desktop (or Docker Engine + Compose plugin).

```bash
# 1. Clone and enter the repo
git clone <repo-url> mi-calendario-app
cd mi-calendario-app

# 2. Set up backend secrets
cp backend/.env.example backend/.env
# Edit backend/.env — set strong JWT secrets

# 3. Start the dev environment (frontend + backend, with hot reload)
docker compose up --build

# Frontend → http://localhost:5173
# GraphQL Playground → http://localhost:4001/graphql
```

## Quick start (local, no Docker)

```bash
# Install all workspace dependencies from root
npm install

# Run backend and frontend concurrently
npm run dev
```

See [docs/dev-guide.md](docs/dev-guide.md) for details.

## Known limitations / open tasks

- **Login page is missing.** Auth guard redirects unauthenticated users to `VITE_LOGIN_URL` (defaults to `http://localhost:4321/login`). That auth app currently lives outside this repo. A `/login` + `/register` view needs to be added to the Vue frontend and the env var updated to `/login`.
- **No auth protection on GraphQL resolvers.** The `authenticateToken` Express middleware is registered after Apollo's middleware and does not intercept `/graphql` requests. Resolvers receive `context.user = null` for all requests. See [docs/architecture.md](docs/architecture.md#known-issues) for details.
- **SQLite only.** Not suitable for production at any scale. Switching to PostgreSQL requires updating `prisma/schema.prisma` and the `DATABASE_URL`.
