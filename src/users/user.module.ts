import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UsersGeneratorService } from './users-generator.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, UsersGeneratorService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
