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

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(name: string): Promise<User | null> {
    return this.userRepository.findOneBy({ name });
  }

  findUserName(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
