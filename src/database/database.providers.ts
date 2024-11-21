import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

export const PG_CONNECTION = 'PG_CONNECTION';

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
];
