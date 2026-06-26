# ─── Base: shared deps + Prisma client generation ────────────────────────────
FROM node:20-alpine AS base

WORKDIR /app

# sqlite3 requires native compilation
RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

# ─── Development: hot-reload via nodemon ─────────────────────────────────────
FROM base AS development

EXPOSE 4001
# Source is bind-mounted by docker-compose, so we only need the entrypoint
CMD ["npm", "run", "dev"]

# ─── Production ──────────────────────────────────────────────────────────────
FROM base AS production

COPY src ./src/

EXPOSE 4001
CMD ["node", "src/app.js"]
