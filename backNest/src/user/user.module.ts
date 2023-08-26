
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Api42Service } from '../api42/api42.service';
import { Api42Module } from '../api42/api42.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => Api42Module),
  MulterModule.register({
	  dest: './uploads',
  }),],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
