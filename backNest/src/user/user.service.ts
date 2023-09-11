import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './user.entity';
import { ChatMessage } from '../chat/chat.entity';
import { Api42Service } from '../api42/api42.service';
import { AchievementGateway } from './user.gateway';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private achievementGateway: AchievementGateway
    // @Inject(forwardRef(() => Api42Service))
    // private  api42Service: Api42Service
  ) {}

  async createUser(User: User): Promise<User> {
    return await this.userRepository.save(User);
  }

  async change_username(login42: string, username: string) {
    await this.userRepository.update(login42, {username:username});
  }

  async change_avatar(login42: string, avatar: string) {
	await this.userRepository.update(login42, {photo: avatar});
  }
  
  async add_pending(login42: string, current_pending_list: string[], friend: string, friend_username) {
    current_pending_list.push(friend);
    this.achievementGateway.server.to(login42).emit('warningToast', friend_username + " wants to be your friend");
    await this.userRepository.update(login42, {pending:current_pending_list});
  }
  
  async remove_pending(login42: string, current_pending_list: string[], friend: string) {
    let new_pending_list: Array<string> = new Array(0); //should this be freed after update??
    for (let iter of current_pending_list) {
      if (iter != friend)
      new_pending_list.push(iter);
    }
    await this.userRepository.update(login42, {pending:new_pending_list});
  }
  
  async block_user(login42: string, current_blocked_users: string[], friend: string) {
    current_blocked_users.push(friend);
    await this.userRepository.update(login42, {blocked_users:current_blocked_users});
  }
  
  async unblock_user(login42: string, current_blocked_users: string[], friend: string) {
    let new_blocked_users: Array<string> = new Array(0);
    for (let iter of current_blocked_users) {
      if (iter != friend) {
        new_blocked_users.push(iter);
      }
    }
    await this.userRepository.update(login42, {blocked_users:new_blocked_users});
  }

  async add_friend(login42: string, current_friend_list: string[], friend: string, friend_username: string) {
    current_friend_list.push(friend);
    this.achievementGateway.server.to(login42).emit('succesToast', "New friend: " + friend_username);
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
    // console.log("win for %s, now at %d wins", login42, win);
    await this.userRepository.update(login42, {win:win});
	if (+win === 50) {
		this.achievementGateway.server.to(login42).emit('succesToast', "New achievement: Master");
		this.achievementGateway.server.to(login42).emit('achievementUpdate');
	}
  }
  
  async addLoss(login42: string, loss: number) {
    // console.log("loss for %s, now at %d loss", login42, loss);
    await this.userRepository.update(login42, {loss:loss});
  }

  async addAchievement(login42: string, achievements: number, current: number) {
    // console.log("achievements of %s now at %d", login42, achievements);
    await this.userRepository.update(login42, {achievements:achievements});
    let message: string = "";
    switch (current) {
      case (0):
      message = "RESET";
      break ;
      case (1):
        message = "Incognito";
        break ;
      case (2):
        message = "Make Up Artist";
        break ;
      case (4):
        message = "Flawless";
        break ;
      case (8):
        message = "You and Me";
        break ;
      case (16):
        message = "Retro Gamer";
        break ;
      case (32):
        message = "Shielded";
        break ;
      case (64):
        message = "G.O.L.D.";
        break ;
      case (128):
        message = "Telekinesis";
        break ;
      case (256):
        message = "Incognhugo";
        break ;
      case (512):
        message = "Double The Trouble";
        break ;
      case (1024):
        message = "All for nothing";
        break ;
      case (2048):
        message = "Is this multiplayer ?";
        break ;
      case (4096):
        message = "This is a library";
        break ;
      default:
        message = "New";
    }
    this.achievementGateway.server.to(login42).emit('succesToast', "New achievement: " + message);
    this.achievementGateway.server.to(login42).emit('achievementUpdate');
  }

  async change_elo(login42: string, newelo: number) {
    if (newelo < 100)
      newelo = 100;
    // console.log("%s now has %d elo", login42, newelo);
    await this.userRepository.update(login42, {elo:newelo});
  }

  async set_status(login42: string, newstatus: string) {
    console.log(login42 + " is now " + newstatus);
    await this.userRepository.update(login42, {status:newstatus});
  }
  
  async set_display_log(login42: string, newValue: boolean) {
    // console.log("displayLog of " + login42 + " is now " + newValue);
    await this.userRepository.update(login42, {displayLogin:newValue});
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

  async getClientId(login42: string) : Promise<string> {
    const user = await this.findOne(login42);
    if (user)
      return user.client_id;
    return "";
  }

  async setClientId(login42: string, client_id: string) {
    await this.userRepository.update(login42, {client_id: client_id});
  }

  //2fa userservives
  async update2faSecret(login42: string, secret : Buffer)
  {
	  await this.userRepository.update(login42, {twofaSecret:secret});
  }

  async enable2fa(login42: string)
  {
	  await this.userRepository.update(login42, {has2fa:true});
    const user = await this.findOne(login42);
    if (user === null) {
      return ;
    }
    if (!(+user.achievements & 32)) {
      this.addAchievement(login42, +user.achievements + 32, 32);
    }
  }

  async disable2fa(login42: string)
  {
	  await this.userRepository.update(login42, {has2fa:false});
	  await this.userRepository.update(login42, {twofaSecret:null});
  }

  //char userservices
  
 	async addMessage(id: string, newMessage: ChatMessage)
	{
		const user: User = await this.findOne(id);
		if (user != null)
		{
			user.messages.push(newMessage);
			await this.userRepository.save(user);
		}
	}
  
  async getLeaderboard() {  
    const users = await this.userRepository.find({
      select: ['username', "elo", 'win', 'loss', 'photo'], 
    });
      return users;
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
