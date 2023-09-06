#!/bin/sh

echo "IN WAIT-FOR-POSTGRES.SH"

# wait-for-postgres.sh
until PGPASSWORD=$POSTGRES_PASSWORD PGUSER=$POSTGRES_USER PGHOST=$POSTGRES_DB_HOST PGDATABASE=$POSTGRES_DB psql -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up"

exec "$@" # npm run start:dev
