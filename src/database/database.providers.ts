import { Pool } from 'pg';

export const PG_CONNECTION = 'PG_CONNECTION';

export const databaseProviders = [
  {
    provide: PG_CONNECTION,
    useValue: new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'somedb',
      password: 'meh',
      port: 5432,
    }),
  },
];