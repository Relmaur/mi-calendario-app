# Architecture

## System diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │                 Vue 3 SPA (Vite)                    │  │
│   │                                                     │  │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │  │
│   │  │  Pinia   │  │  Vue     │  │  Apollo Client   │  │  │
│   │  │  Stores  │  │  Router  │  │  (GraphQL HTTP)  │  │  │
│   │  └──────────┘  └──────────┘  └────────┬─────────┘  │  │
│   └────────────────────────────────────────│────────────┘  │
│                                            │ HTTP POST      │
│                                            │ /graphql       │
└────────────────────────────────────────────│────────────────┘
                                             │
         ┌───────────────────────────────────▼──────────────┐
         │              Express + Apollo Server              │
         │                  (Node.js 20)                    │
         │                                                  │
         │  ┌──────────────┐   ┌────────────────────────┐  │
         │  │  JWT auth    │   │   GraphQL schema +     │  │
         │  │  middleware  │   │   resolvers             │  │
         │  └──────────────┘   └──────────┬─────────────┘  │
         │                                │                 │
         │                    ┌───────────▼──────────────┐  │
         │                    │     Prisma ORM           │  │
         │                    └───────────┬──────────────┘  │
         └────────────────────────────────│─────────────────┘
                                          │
                              ┌───────────▼──────────────┐
                              │   SQLite database        │
                              │   (app.db)               │
                              └──────────────────────────┘
```

## Request lifecycle

1. Browser loads the Vue SPA. `App.vue` reads `userSession` cookie → hydrates Pinia `mainApp` store.
2. Vue Router guard checks for `accessToken` / `refreshToken` cookies. If absent, redirects to `VITE_LOGIN_URL`.
3. On authenticated load, `App.vue` fires a `getUser` GraphQL query via Apollo. The result is stored in `mainApp.userSchedules` and the active schedule's `week` JSON is parsed into `userWeek` store.
4. User interactions (add/edit/drag a subject) mutate the `userWeek` store in-memory and call the `updateWeek` GraphQL mutation to persist.
5. The `week` field on `Schedule` stores the entire weekly timetable as a JSON string — a flat key-value map of `{ monday: [...subjects], tuesday: [...], … }`.

## Auth flow detail

```
External auth app (port 4321)       Vue SPA                    Backend
       │                               │                           │
       │  POST /graphql login mutation ─────────────────────────►  │
       │  ◄────────── { accessToken, refreshToken, user } ─────────│
       │  Set cookies: accessToken, refreshToken, userSession       │
       │  Redirect to http://localhost:5173/ ──────────────────►   │
       │                               │                           │
       │                      Read cookies on load                 │
       │                      Hydrate Pinia stores                 │
       │                               │                           │
       │                      Apollo → GET_USER query ────────────►│
       │                               ◄──── user + schedules ─────│
```

## Data model detail

### `week` JSON structure

The `week` column on `Schedule` is a serialized JSON object. Based on the frontend store and component usage, it has this shape:

```json
{
  "monday": [
    {
      "id": "uuid",
      "name": "Mathematics",
      "color": "#4CAF50",
      "info": "optional rich text",
      "infoDelta": "optional Quill delta JSON string",
      "raw": {
        "starts": "2024-01-15T09:00:00.000Z",
        "duration": 60
      }
    }
  ],
  "tuesday": [],
  "wednesday": [],
  "thursday": [],
  "friday": [],
  "saturday": [],
  "sunday": []
}
```

## Known issues

### 1. Auth middleware ordering (critical)

In `backend/src/app.js`:

```js
server.applyMiddleware({ app, path: '/graphql' });  // ← Apollo registered first
// ...
app.use(authenticateToken);  // ← runs AFTER Apollo; never intercepts /graphql
```

Fix: move `app.use(authenticateToken)` before `server.applyMiddleware(...)`. Then update resolvers to check `context.user` where needed, and exempt the `login`/`register` mutations from the middleware.

### 2. Missing login page

The router and `cookies.logout()` redirect to `VITE_LOGIN_URL` (default: `http://localhost:4321/login`). That Astro app is not in this repository. Until a `/login` route is added to the Vue app and `VITE_LOGIN_URL` is set to `/login`, new sessions cannot be created via the containerized stack alone.

### 3. Token expiry not validated client-side

`isAuthenticated()` in `router/index.js` returns truthy as long as the cookie exists, regardless of expiry. A 403 from the API is the only signal. Fix: decode the JWT on the client (without verifying signature) and check `exp` before routing.

### 4. SQLite concurrency limit

SQLite serializes all writes. Under concurrent writes (e.g., multiple users saving simultaneously) you will see lock errors. For production with multiple users, switch to PostgreSQL: update `datasource db` in `prisma/schema.prisma` and set `DATABASE_URL` to a Postgres connection string.

## Directory deep-dive

### `backend/src/`

```
app.js              Express + Apollo bootstrap
api/
  schema/schema.js  GraphQL SDL (typeDefs)
  resolvers/
    resolvers.js    All query + mutation implementations
database/
  database.js       Prisma client singleton export
  app.db            SQLite file (gitignored)
```

### `frontend/src/`

```
main.js             App bootstrap (Vue, Pinia, PrimeVue, router, Apollo)
apolloClient.js     Apollo Client configuration
App.vue             Root component — loads user data, renders RouterView + popups
router/index.js     Routes: / (Home) and /settings — both guarded
views/
  Home.vue          Assembles LeftSide + RightSide layouts
  Settings.vue      Settings placeholder
layouts/
  LeftSide.vue      Sidebar: logo, nav tabs, day subjects widget
  RightSide.vue     Main content area
  view/
    AppHeader.vue   Top bar: search, user avatar
    AppBody.vue     Main scroll area
    calendar/       Calendar week view
    schedule/       Schedule list view + Subjects component
components/
  NavigationTabs    Tab switcher (Calendar / Schedule views)
  SearchBarAndUser  Search + user avatar
  popups/
    AddItem/        Add subject popup (calendar + schedule variants)
    EditItem/       Edit/delete subject popup
    Toasts/         Toast notification
    settingsMenu/   Settings popup
  subject/          Subject card component
store/
  mainApp.js        Core app state (user, schedules, active schedule, sidebar)
  userWeek.js       Parsed week timetable for the active schedule
  cookies.js        Token storage + logout
  popups.js         Modal open/close state
  tabs.js           Navigation tab state
  subjectsColorTheme.js  Color palette for subject cards
styles/
  main.scss         Imports all partials
  abstracts/        SCSS variables + utilities
  base/             CSS reset
  components/       Per-component SCSS
  layouts/          Layout-level SCSS
```
