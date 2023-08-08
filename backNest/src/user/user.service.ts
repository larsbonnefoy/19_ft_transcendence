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

  async change_username(login42: string, username: string) {
    await this.userRepository.update(login42, {username:username});
  }
  
  async add_friend(login42: string, current_friend_list: string[], friend: string) {
    current_friend_list.push(friend);
    await this.userRepository.update(login42, {friends:current_friend_list});
  }

  async remove_friend(login42: string, current_friend_list: string[], friend: string) {
    let new_friend_list: Array<string> = new Array(0);
    for (let iter of current_friend_list) {
      if (iter != friend)
        new_friend_list.push(iter);
    }
    await this.userRepository.update(login42, {friends:new_friend_list});
  }
  
  async addWin(login42: string, win: number) {
    await this.userRepository.update(login42, {win:win});
  }

  async addLoss(login42: string, loss: number) {
    await this.userRepository.update(login42, {loss:loss});
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(str: string): Promise<User | null> {
    return this.userRepository.findOneBy({ login42:str });
  }

  findUsername(str: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username:str });
  }

  // getUsername(login42: string): string {
  //   const user = this.userRepository.findOneBy({ login42:login42 });
  //   if (user == null)
  //     return "";
  //   return user.then.arguments.username;
  // }

  // getLoginFromUsername(username: string): string {
  //   const user = this.userRepository.findOneBy({ username: username });
  //   if (user == null)
  //     return "";
  //   return user.then.arguments.login42;
  // }

  async remove(username: string): Promise<void> {
    await this.userRepository.delete({username:username});
  }
}