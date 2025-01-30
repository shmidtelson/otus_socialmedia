import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

export const PG_CONNECTION = 'PG_CONNECTION';
export const PG_READ_REPLICA_CONNECTION = 'PG_READ_REPLICA_CONNECTION';

export const databaseProviders = [
  {
    provide: PG_CONNECTION,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return new Pool({
        user: configService.get<string>('PG_USER', 'postgres'),
        host: configService.get<string>('PG_HOST', 'otus_postgres'),
        database: configService.get<string>('PG_DB', 'postgres'),
        password: configService.get<string>('PG_PASS', 'postgres'),
        port: configService.get<number>('PG_PORT', 5432),
      });
    },
  },
  // Read replica connection pool
  {
    provide: PG_READ_REPLICA_CONNECTION,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const hosts = configService
        .get<string>('PG_READ_REPLICA_HOST', '')
        .split(',');
      const user = configService.get<string>(
        'PG_READ_REPLICA_USER',
        'replicator_user',
      );
      const password = configService.get<string>('PG_READ_REPLICA_PASS', '');

      // Create multiple replica pools
      return hosts.map(
        (host) =>
          new Pool({
            user,
            host,
            database: configService.get<string>('PG_DB', 'postgres'),
            password,
            port: configService.get<number>('PG_PORT', 5432),
          }),
      );
    },
  },
];
