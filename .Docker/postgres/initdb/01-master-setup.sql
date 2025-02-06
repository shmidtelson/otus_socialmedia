-- Включение репликации
ALTER SYSTEM SET wal_level = 'replica';
ALTER SYSTEM SET max_wal_senders = 3;
ALTER SYSTEM SET hot_standby = 'on';
ALTER SYSTEM SET listen_addresses = '*';
SELECT pg_reload_conf();

-- Создание роли для репликации
CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'replicator_password';