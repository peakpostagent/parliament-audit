#!/bin/sh
set -e

case "$SERVICE" in
  web)
    cd /app/apps/web/.next/standalone && exec node apps/web/server.js
    ;;
  admin)
    cd /app/apps/admin/.next/standalone && exec node apps/admin/server.js
    ;;
  migrate)
    cd /app/packages/db && exec npx drizzle-kit push
    ;;
  *)
    cd /app/services/$SERVICE && exec npm start
    ;;
esac
