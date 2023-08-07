import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(User: User): Promise<User> {
    return await this.userRepository.save(User);
  }
  
  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  getHello(): string {
    return 'Hello World! - from backnest';
  }
  getJSON(name:string, id:Number): object {
    return {"message":"Succesfully got request","ViewedPage":name,"RequestNumber":id};
  }
}
