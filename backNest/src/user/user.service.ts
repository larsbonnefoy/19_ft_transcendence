import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(User: User): Promise<User> {
    return await this.userRepository.save(User);
  }

  async change_username(loggin42: string, username: string) {
    await this.userRepository.update(loggin42, {username:username});
  }

  async addWin(loggin42: string, win: number) {
    await this.userRepository.update(loggin42, {win:win});
  }

  async addLoss(loggin42: string, loss: number) {
    await this.userRepository.update(loggin42, {loss:loss});
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(str: string): Promise<User | null> {
    return this.userRepository.findOneBy({ loggin42:str });
  }

  findUsername(str: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username:str });
  }

  async remove(loggin42: string): Promise<void> {
    await this.userRepository.delete(loggin42);
  }
}
