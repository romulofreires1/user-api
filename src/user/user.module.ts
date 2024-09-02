import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { EncryptionService } from './encryption.service';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PrometheusModule.register()],
  providers: [
    UserService,
    UserRepository,
    EncryptionService,
    makeCounterProvider({
      name: 'user_created_total',
      help: 'Total number of users created',
    }),
    makeCounterProvider({
      name: 'user_find_all_total',
      help: 'Total number of findAll calls',
    }),
    makeCounterProvider({
      name: 'user_find_one_total',
      help: 'Total number of findOne calls',
    }),
    makeCounterProvider({
      name: 'user_update_total',
      help: 'Total number of update calls',
    }),
    makeCounterProvider({
      name: 'user_remove_total',
      help: 'Total number of remove calls',
    }),
    makeCounterProvider({
      name: 'user_find_by_email_total',
      help: 'Total number of findByEmail calls',
    }),
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
