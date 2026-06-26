# CLAUDE.md — Mi Calendario

Context for AI coding assistants working in this repository.

## Project overview

Mi Calendario is a personal weekly scheduling web app. Users register/log in, then create *schedules* (named weekly timetables) and fill each day with *subjects* (named time blocks with color, duration, optional notes). The UI renders a visual weekly grid.

## Architecture at a glance

```
Browser
  │  Vue 3 SPA (port 5173 dev / 80 prod)
  │  Apollo Client → GraphQL over HTTP
  ▼
Express + Apollo Server (port 4001)
  │  JWT middleware → context.user
  │  Prisma ORM
  ▼
SQLite (file: backend/src/database/app.db)
```

### Services

| Service | Path | Runtime | Port |
|---|---|---|---|
| Backend API | `backend/` | Node.js 20 (CommonJS) | 4001 |
| Frontend SPA | `frontend/` | Vite dev / Nginx prod | 5173 / 80 |

### Auth flow

1. User submits credentials to the GraphQL `login` or `register` mutation.
2. Backend returns `{ accessToken, refreshToken, user }`.
3. **The auth app** (currently outside this repo, historically on port 4321) sets `accessToken`, `refreshToken`, and `userSession` as cookies, then redirects to the Vue SPA.
4. The Vue Router `beforeEnter` guard reads those cookies. If missing, it redirects to `VITE_LOGIN_URL`.
5. `App.vue` reads `userSession` cookie (JSON-encoded user object) to hydrate the Pinia store on load.
6. Apollo Client sends the `accessToken` cookie with every GraphQL request (via browser's automatic cookie forwarding — **note: currently no `Authorization` header is set** by the frontend).

### Key known issues

1. **Auth middleware ordering bug in `backend/src/app.js`.** `app.use(authenticateToken)` is registered *after* `server.applyMiddleware({ app, path: '/graphql' })`. Express processes middleware in registration order, so the auth check never runs before GraphQL resolvers. `context.user` is always `null`. Resolvers do not currently enforce auth (no resolver checks `context.user`), so the API is effectively public.
2. **SQLite in production.** The Prisma schema uses `provider = "sqlite"`. Not suitable for concurrent writes or horizontal scaling. Migration to PostgreSQL is straightforward — update `prisma/schema.prisma` and `DATABASE_URL`.
3. **Token expiration not validated on client.** The router guard in `frontend/src/router/index.js` checks only for cookie *presence*, not JWT expiry. A user with an expired token will pass the guard but their GraphQL requests will fail silently.

## Data models

```
User
  id          Int   PK autoincrement
  userName    String unique
  email       String unique
  password    String (bcrypt hash)
  subscription String default "free"
  schedules   Schedule[]

Schedule
  id          Int   PK autoincrement
  title       String
  description String
  date        DateTime
  week        String   ← JSON blob: the entire weekly timetable
  userId      Int      FK → User.id
```

The `week` field on `Schedule` is a serialized JSON string representing the full week data structure. It is read/written as an opaque blob by the frontend — `userWeek` store parses it and the `updateWeek` mutation writes it back.

## GraphQL API

**Queries**
- `user(id: ID!): User` — fetch user with their schedules
- `users: [User!]!` — all users (dev/admin only)
- `schedules: [Schedule!]!` — all schedules
- `week(id: ID!): String!` — raw week JSON for a schedule

**Mutations**
- `register(email, password): AuthPayload`
- `login(email, password): AuthPayload`
- `refreshToken(token): AuthPayload`
- `updateWeek(id, week, userId): Week` — save the full timetable blob

## Frontend state (Pinia stores)

| Store | File | Purpose |
|---|---|---|
| `mainApp` | `store/mainApp.js` | User object, schedules list, active schedule, sidebar state, selected day |
| `userWeek` | `store/userWeek.js` | Parsed week timetable for the active schedule |
| `cookies` | `store/cookies.js` | Token access, logout helper |
| `popups` | `store/popups.js` | Open/close state for all modal popups |
| `tabs` | `store/tabs.js` | Navigation tab active state |
| `subjectsColorTheme` | `store/subjectsColorTheme.js` | Color palette for subjects |

## Environment variables

### Backend (`backend/.env`)
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Prisma connection string, e.g. `file:../src/database/app.db` |
| `ACCESS_TOKEN_SECRET` | JWT signing secret for access tokens |
| `REFRESH_TOKEN_SECRET` | JWT signing secret for refresh tokens |
| `PORT` | Server port (default 4001) |

### Frontend (`frontend/.env`)
All vars must be prefixed `VITE_` to be available in client code (`import.meta.env.VITE_*`).

| Variable | Purpose |
|---|---|
| `VITE_GRAPHQL_URL` | GraphQL endpoint, e.g. `http://localhost:4001/graphql` |
| `VITE_LOGIN_URL` | Full URL of the login page redirect |

**Important:** Vite bakes these values into the JS bundle at *build time*. They are not read at runtime by the Nginx container. Pass them as Docker build args in production (see `docker-compose.prod.yml`).

## Conventions

- Backend uses **CommonJS** (`require`/`module.exports`) throughout.
- Frontend uses **ESM** (`import`/`export`). Vite handles transpilation.
- Styles live in `frontend/src/styles/` as SCSS modules, with Tailwind utility classes used inline in templates.
- Popup components (`AddItem`, `EditItem`, `SettingsMenu`, `Toast`) are conditionally rendered from `App.vue` using `v-if` driven by the `popups` store.
- The `week` JSON structure is the central data shape of the app — understand it before touching schedule or subject logic.

## Docker setup

- `docker compose up --build` starts both services with hot reload (Vite HMR + nodemon).
- Source dirs are bind-mounted into the containers; `node_modules` lives only inside the image.
- The SQLite database file is bind-mounted to `backend/src/database/` so data persists across restarts.
- For production: `docker compose -f docker-compose.prod.yml up --build`. Pass `VITE_*` values in the root `.env` file — they are injected as Docker build args.
