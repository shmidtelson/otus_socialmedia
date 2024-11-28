import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { CommandTutorial } from './commands/generate-users';
import { UserService } from './users/users-generator.service';
import { databaseProviders } from './database/database.providers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PassportModule,
    UserModule,
    AuthModule,
  ],
  providers: [...databaseProviders, CommandTutorial, UserService],
})
export class AppModule {}
