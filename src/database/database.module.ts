import { Module } from '@nestjs/common';
import { Pool } from 'pg';

const PG_CONNECTION = 'PG_CONNECTION';

const dbProvider = {
  provide: PG_CONNECTION,
  useValue: new Pool({
    user: 'postgres',
    host: 'otus_postgres',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
  }),
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}