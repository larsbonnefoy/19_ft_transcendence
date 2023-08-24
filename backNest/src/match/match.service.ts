import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Match } from './match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  async createMatch(Match: Match): Promise<Match> {
    return await this.matchRepository.save(Match);
  }

  findAll(): Promise<Match[]> {
    return this.matchRepository.find();
  }

  findOne(id: number): Promise<Match | null> {
    return this.matchRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.matchRepository.delete(id);
  }
}

