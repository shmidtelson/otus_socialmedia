#!/bin/bash

# Function to log messages with a timestamp
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') $1"
}

# Wait for the primary (master) to become available
log "Waiting for the primary server to become available..."
until pg_isready -h db -p 5432 > /dev/null 2>&1; do
  log "Primary server is not available yet. Retrying..."
  sleep 2
done

# Clear existing data directory if it exists
if [ -d "/var/lib/postgresql/data/pgdata" ]; then
  log "Data directory exists. Clearing existing data..."
  rm -rf /var/lib/postgresql/data/pgdata/*
else
  log "Data directory does not exist. Creating it..."
  mkdir -p /var/lib/postgresql/data/pgdata
fi

# Perform base backup from the primary server
log "Performing base backup from the primary server..."
#PGPASSWORD=replicator_password pg_basebackup -h db -D /var/lib/postgresql/data/pgdata -U replicator -Ft -z -X stream -P
PGPASSWORD=replicator_password pg_basebackup -h db -D /var/lib/postgresql/data/pgdata -U replicator -v -P --wal-method=stream

if [ $? -ne 0 ]; then
  log "Base backup failed. Exiting..."
  exit 1
fi

# Configure the standby (replica) settings
log "Configuring replication settings..."
echo "primary_conninfo = 'host=db port=5432 user=replicator password=replicator_password'" >> /var/lib/postgresql/data/pgdata/postgresql.auto.conf

# Create the standby.signal file (required for replicas in PostgreSQL 12+)
touch /var/lib/postgresql/data/pgdata/standby.signal

log "Replica configuration is complete. PostgreSQL will start normally."
