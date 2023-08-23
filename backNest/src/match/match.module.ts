
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service';
import { Match } from './match.entity';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { MatchGateway } from './match.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User, Match])],
  controllers: [MatchController],
  providers: [UserService, MatchService, MatchGateway],
})
export class MatchModule {}
