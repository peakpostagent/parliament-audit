#!/bin/sh
set -e

case "$SERVICE" in
  web)
    cd /app/apps/web && exec npm start
    ;;
  admin)
    cd /app/apps/admin && exec npm start
    ;;
  migrate)
    cd /app/packages/db && exec npx drizzle-kit push
    ;;
  *)
    cd /app/services/$SERVICE && exec npm start
    ;;
esac
