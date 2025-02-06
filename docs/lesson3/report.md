### 3 репликация

#### Настройка
* Настройка grafana docker monitoring сделана по этой статье https://medium.com/@varunjain2108/monitoring-docker-containers-with-cadvisor-prometheus-and-grafana-d101b4dbbc84
* Добавим строки в db master `hba.conf`
  * `host replication replicator 0.0.0.0/0 trust`
* Выполню для слейвов бэкап 
  * `pg_basebackup -h db -D /var/lib/postgresql/data -U replication --password --checkpoint=fast --wal-method=stream`

#### Нагрузка на реплики, запросы на чтение
![Нагрузка на реплики](./1.png)
#### Код выбора базы на чтение из реплик
![Нагрузка на реплики](./2.png)

#### Нагружаем систему и отключаем 1 реплику
Ошибки в консоли
![Ошибка выбора реплики](3.png)

Потеря подключения к 1 реплике
![4.png](4.png)

Тем не менее бэкенд отвечает
![img.png](img.png)

#### Стопаем master и делаем slave1 master 
![img_1.png](img_1.png)

Проверяем стал ли мастером?
![Стал](2025-02-06_21-32.png)

Слейв2 остался репликой но для нового мастера
![Репликация продолжилась](2025-02-06_21-33.png)

