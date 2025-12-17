#!/bin/sh
set -eu

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  if [ -n "${DATABASE_URL:-}" ]; then
    mkdir -p /app/data
    npx prisma migrate deploy
  fi
fi

exec "$@"
