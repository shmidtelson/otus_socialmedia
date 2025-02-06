#!/bin/bash

# Location of pg_hba.conf
PG_HBA_FILE="/var/lib/postgresql/data/pgdata/pg_hba.conf"  # Change as needed

# Ensure the file exists
if [ ! -f "$PG_HBA_FILE" ]; then
  echo "Error: $PG_HBA_FILE does not exist."
  exit 1
fi

# Add replication entry
echo "Adding replication entry to pg_hba.conf"
echo "host    replication replicator             0.0.0.0/0           trust" >> "$PG_HBA_FILE"

# Add general access entry
echo "Adding general access entry to pg_hba.conf"
echo "host    all             all             0.0.0.0/0           md5" >> "$PG_HBA_FILE"

# Reload PostgreSQL to apply changes
echo "Reloading PostgreSQL configuration"
if command -v pg_ctl > /dev/null; then
  pg_ctl reload -D /var/lib/postgresql/data/pgdata   # Adjust data directory path if needed
elif command -v systemctl > /dev/null; then
  sudo systemctl reload postgresql
else
  echo "Error: Unable to reload PostgreSQL. Please reload it manually."
fi

echo "pg_hba.conf updated successfully!"