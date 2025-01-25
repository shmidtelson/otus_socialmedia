### 3 репликация

#### Порядок
* Настройка grafana docker monitoring сделана по этой статье https://medium.com/@varunjain2108/monitoring-docker-containers-with-cadvisor-prometheus-and-grafana-d101b4dbbc84
* Добавим строки в db master `hba.conf`
  * `host replication postgres postgres_slave_1 md5`
  * `host replication postgres postgres_slave_2 md5`
* Выполню для слейвов бэкап 
  * `pg_basebackup -h db -D /var/lib/postgresql/data/pgdata -U postgres -v -P --wal-method=stream`