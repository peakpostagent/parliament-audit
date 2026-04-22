# ─────────────────────────────────────────────────────────────────────────────
# Parliament Audit — multi-service Dockerfile
# Build: docker build --build-arg SERVICE=web -t pa-web .
# Run:   docker run -p 3000:3000 pa-web
#
# SERVICE values:
#   web               → Next.js public site (port 3000)
#   admin             → Next.js admin dashboard (port 3001)
#   source-watcher    → Cron poller for ourcommons.ca
#   vote-normalizer   → BullMQ worker
#   content-generator → BullMQ worker (Claude AI)
#   publisher         → BullMQ worker
#   correction-worker → BullMQ worker
#   migrate           → Run Drizzle migrations then exit
# ─────────────────────────────────────────────────────────────────────────────

ARG SERVICE=web

# ── Stage 1: Install dependencies ────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages/db/package.json        packages/db/
COPY packages/shared/package.json    packages/shared/
COPY services/queue/package.json     services/queue/
COPY services/source-watcher/package.json     services/source-watcher/
COPY services/vote-normalizer/package.json    services/vote-normalizer/
COPY services/content-generator/package.json  services/content-generator/
COPY services/publisher/package.json          services/publisher/
COPY services/correction-worker/package.json  services/correction-worker/
COPY apps/web/package.json           apps/web/
COPY apps/admin/package.json         apps/admin/

RUN npm ci --ignore-scripts

# ── Stage 2: Build everything ────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Dummy DATABASE_URL for Next.js build (not used at runtime)
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"

# NEXT_PUBLIC_* vars must be declared as ARGs so Railway can inject them
# at build time — otherwise Next.js sees `undefined` and inlines `null`
# into SSG bundles (the Analytics component then renders nothing on
# statically-generated routes like /news, /about, /bill/[n], /mp/[s]).
ARG NEXT_PUBLIC_UMAMI_URL
ARG NEXT_PUBLIC_UMAMI_WEBSITE_ID
ENV NEXT_PUBLIC_UMAMI_URL=${NEXT_PUBLIC_UMAMI_URL}
ENV NEXT_PUBLIC_UMAMI_WEBSITE_ID=${NEXT_PUBLIC_UMAMI_WEBSITE_ID}

ARG SERVICE=web
RUN if [ "$SERVICE" = "web" ]; then \
      npx turbo build --filter=@parliament-audit/web...; \
    elif [ "$SERVICE" = "admin" ]; then \
      npx turbo build --filter=@parliament-audit/admin...; \
    else \
      npx turbo build --filter=@parliament-audit/$SERVICE...; \
    fi

# ── Stage 3: Production runner ───────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ARG SERVICE
ENV SERVICE=${SERVICE}
ENV NODE_ENV=production

# Copy the entire built monorepo (simple & reliable — optimise later)
COPY --from=builder /app ./

# Next.js standalone mode: copy static assets into standalone directory
RUN if [ "$SERVICE" = "web" ]; then \
      mkdir -p /app/apps/web/.next/standalone/apps/web/.next && \
      cp -r /app/apps/web/.next/static /app/apps/web/.next/standalone/apps/web/.next/static && \
      if [ -d /app/apps/web/public ]; then cp -r /app/apps/web/public /app/apps/web/.next/standalone/apps/web/public; fi; \
    elif [ "$SERVICE" = "admin" ]; then \
      mkdir -p /app/apps/admin/.next/standalone/apps/admin/.next && \
      cp -r /app/apps/admin/.next/static /app/apps/admin/.next/standalone/apps/admin/.next/static && \
      if [ -d /app/apps/admin/public ]; then cp -r /app/apps/admin/public /app/apps/admin/.next/standalone/apps/admin/public; fi; \
    fi

# Copy and make entrypoint executable
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN sed -i 's/\r$//' /app/docker-entrypoint.sh && chmod +x /app/docker-entrypoint.sh

# Remove dev dependencies
RUN npm prune --omit=dev 2>/dev/null || true

EXPOSE 3000 3001

ENTRYPOINT ["/app/docker-entrypoint.sh"]
