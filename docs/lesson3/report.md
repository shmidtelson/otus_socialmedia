### 3 репликация

#### Порядок
* Настройка grafana docker monitoring сделана по этой статье https://medium.com/@varunjain2108/monitoring-docker-containers-with-cadvisor-prometheus-and-grafana-d101b4dbbc84
* Добавим строки в db master `hba.conf`
  * `host replication replicator 0.0.0.0/0 trust`
* Выполню для слейвов бэкап 
  * `pg_basebackup -h db -D /var/lib/postgresql/data -U replication --password --checkpoint=fast --wal-method=stream`