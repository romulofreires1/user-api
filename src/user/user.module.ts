import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { EncryptionService } from './encryption.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserRepository, EncryptionService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
