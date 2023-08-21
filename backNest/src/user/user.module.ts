
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Api42Service } from '../api42/api42.service';
import { Api42Module } from '../api42/api42.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => Api42Module)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
