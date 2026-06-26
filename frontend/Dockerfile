# ─── Base: install dependencies ───────────────────────────────────────────────
FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

# ─── Development: Vite dev server with HMR ────────────────────────────────────
FROM base AS development

EXPOSE 5173
# Source dirs are bind-mounted by docker-compose
CMD ["npm", "run", "dev"]

# ─── Build: compile static assets ─────────────────────────────────────────────
FROM base AS build

COPY . .

# Accept env vars as build args so Vite can embed them at build time
ARG VITE_GRAPHQL_URL=http://localhost:4001/graphql
ARG VITE_LOGIN_URL=http://localhost:4321/login

ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL
ENV VITE_LOGIN_URL=$VITE_LOGIN_URL

RUN npm run build

# ─── Production: serve compiled assets with Nginx ─────────────────────────────
FROM nginx:stable-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
