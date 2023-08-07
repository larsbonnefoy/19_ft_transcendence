
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service';
import { Match } from './match.entity';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Match])],
  controllers: [MatchController],
  providers: [UserService, MatchService],
})
export class MatchModule {}
