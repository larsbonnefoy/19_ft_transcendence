import { Controller, Get, Post, Param, Query, ParseIntPipe, ParseUUIDPipe, Res } from '@nestjs/common';
import { Response } from 'express';
// import { IsInt, IsString } from 'class-validator';
// import { identity } from 'rxjs';

import { User, UserStatus } from './user.entity';
import { UserService } from './user.service';
import { newUserDto, changeUsernameDto, setStatusDto, setFriendsDto } from './userDto.dto';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('LogFromUser:username')
  async LogFromUser(@Res() res: Response, @Param() params: any) {
    const username: string = params.username.slice(1);
    const user = await this.userService.findUsername(username);
    if (user == null) {
      res.status(409).json({"error":"no user with that username"});
      return ;
    }
    res.json({"login42":user.login42});
  }
  
  @Get('UserFromLog:login42')
  async UserFromLog(@Res() res: Response, @Param() params: any) {
    const login42: string = params.login42.slice(1);
    const user = await this.userService.findOne(login42);
    if (user == null) {
      res.status(409).json({"error":"no user with that login"});
      return ;
    }
    res.json({"username":user.username});
  }

  @Get('getElo:login42')
  async GetEloFromLogin(@Res() res: Response, @Param() params: any) {
    const login42: string = params.login42.slice(1);
    const user = await this.userService.findOne(login42);
    if (user == null) {
      res.status(409).json({"error":"no user with that login"});
      return ;
    }
    res.json({"elo":user.elo});
  }

  @Get('getStatus:login42')
  async GetStatusFromLogin(@Res() res: Response, @Param() params: any) {
    const login42: string = params.login42.slice(1);
    const user = await this.userService.findOne(login42);
    if (user == null) {
      res.status(409).json({"error":"no user with that login"});
      return ;
    }
    res.json({"status":user.status});
  }

  /* Could take jwt_Token instead of login42 */
  @Get('setStatus:login42')
  async SetStatusFromLogin(@Res() res: Response, @Param() params: any, @Query() query: setStatusDto) {
    if (query.new < 0 || query.new > 2) {
      res.status(409).json({"error":"status must be 0 1 2"});
      return ;
    }
    const login42: string = params.login42.slice(1);
    const user = await this.userService.findOne(login42);
    if (user == null) {
      res.status(409).json({"error":"no user with that login"});
      return ;
    }
    console.log("%s is now %s", login42, UserStatus[query.new]);
    await this.userService.set_status(login42, UserStatus[query.new]);
    res.json({"success":`status changed from ${user.status} to ${UserStatus[query.new]}`});
  }
 
  @Get('one:username')
  async getOneUser(@Res() res: any, @Param() params: any) {
    const username: string = params.username.slice(1);
    console.log("got request for user with username %s", username);
    const messages = await this.userService.findUsername(username);
    res.json(messages);
  }
  
  @Get('addWin:username')
  async addWin(@Res() res: Response, @Param() params: any) {
    const username: string = params.username.slice(1);
    console.log("increment win field for user with username %s", username);
    const current_user = await this.userService.findUsername(username);
    if (current_user == null) {
      res.status(409).json({"error":`no user with ${username} as username`});
      return ;
    }
    let wins:number = current_user.win;
    ++wins;
    await this.userService.addWin(current_user.login42, wins);
    res.json({"success":`${username} now has ${wins} wins`});
  }
  
  @Get('addLoss:username')
  async addLoss(@Res() res: any, @Param() params: any) {
    const username: string = params.username.slice(1);
    console.log("increment loss field for user with username %s", username);
    const current_user = await this.userService.findUsername(username);
    if (current_user == null) {
      res.status(409).json({"error":`no user with ${username} as username`});
      return ;
    }
    let loss:number = current_user.loss;
    ++loss;
    await this.userService.addLoss(current_user.login42, loss);
    res.json({"success":`${username} now has ${loss} loss`});
  }

  @Get('change_username')
  async changeUsername(@Res() res: any, @Query() query: changeUsernameDto) {
    console.log("changing username form %s to %s", query.old, query.new);
    if (query.old == query.new) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
      return ;
    }
    const current_user = await this.userService.findUsername(query.old);
    if (current_user == null) {
      res.status(409).json({"error":`no user with ${query.old} as username`});
      return ;
    }
    const check_base = await this.userService.findUsername(query.new);
    if (check_base != null) {
      res.status(409).json({"error":`username ${query.new} already taken`});
      return ;
    }
    await this.userService.change_username(current_user.login42, query.new);
    res.json({"success":`username changed from ${query.old} to ${query.new}`});
  }

  @Get('add_friend')
  async addFriend(@Res() res:any, @Query() query: setFriendsDto) {
    console.log("%s sends friend request to %s", query.f1, query.f2);
    if (query.f1 == query.f2) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
      return ;
    }
    const user_1 = await this.userService.findUsername(query.f1);
    const user_2 = await this.userService.findUsername(query.f2);
    if (user_1 == null || user_2 == null) {
      res.status(409).json({"error":`no user with such username`});
      return ;
    }
    for (let friend of user_1.friends) {
      if (friend == user_2.login42) {
        res.status(409).json({"error":"c'est déjà ton pote boloss"});
        return ;
      }
    }
    for (let pending of user_2.pending) {
      if (pending == user_1.login42) {
        res.status(409).json({"error":"tu l'as déjà invité boloss"});
        return ;
      }
    }
    await this.userService.add_pending(user_2.login42, user_2.pending, user_1.login42);
    res.json({"success":`${query.f1} sent friend request to ${query.f2}`});
  }
  
  @Get('remove_request')
  async removeRequest(@Res() res:any, @Query() query: setFriendsDto) {
    console.log("%s removes friend request towards %s", query.f1, query.f2);
    if (query.f1 == query.f2) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
      return ;
    }
    const user_1 = await this.userService.findUsername(query.f1);
    const user_2 = await this.userService.findUsername(query.f2);
    if (user_1 == null || user_2 == null) {
      res.status(409).json({"error":`no user with such username`});
      return ;
    }
    let notpending: boolean = true;
    for (let pending of user_2.pending) {
      if (pending == user_1.login42) {
        notpending = false;
        break ;
      }
    }
    if (notpending) {
      res.status(409).json({"error":"can't remove request if no request in first place"});
      return ;
    }
    await this.userService.remove_pending(user_2.login42, user_2.pending, user_1.login42);
    res.json({"success":`${query.f1} withdrew friend request to ${query.f2}`});
  }
  
  @Get('accept_request')
  async acceptRequest(@Res() res:any, @Query() query: setFriendsDto) {
    console.log("%s accepts %s friend request", query.f1, query.f2);
    if (query.f1 == query.f2) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
      return ;
    }
    const user_1 = await this.userService.findUsername(query.f1);
    const user_2 = await this.userService.findUsername(query.f2);
    if (user_1 == null || user_2 == null) {
      res.status(409).json({"error":`no user with such username`});
      return ;
    }
    console.log("debug");
    let notpending: boolean = true;
    for (let pending of user_1.pending) {
      if (pending == user_2.login42) {
        notpending = false;
        break ;
      }
    }
    if (notpending) {
      res.status(409).json({"error":"can't accept request if no request in first place"});
      return ;
    }
    await this.userService.remove_pending(user_1.login42, user_1.pending, user_2.login42);
    await this.userService.add_friend(user_1.login42, user_1.friends, user_2.login42);
    await this.userService.add_friend(user_2.login42, user_2.friends, user_1.login42);
    res.json({"success":`friendship blooming between ${query.f1} and ${query.f2}`});
  }
  
  @Get('refuse_request')
  async refuseRequest(@Res() res:any, @Query() query: setFriendsDto) {
    console.log("%s refuses %s friend request", query.f1, query.f2);
    if (query.f1 == query.f2) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
      return ;
    }
    const user_1 = await this.userService.findUsername(query.f1);
    const user_2 = await this.userService.findUsername(query.f2);
    if (user_1 == null || user_2 == null) {
      res.status(409).json({"error":`no user with such username`});
      return ;
    }
    let notpending: boolean = true;
    for (let pending of user_1.pending) {
      if (pending == user_2.login42) {
        notpending = false;
        break ;
      }
    }
    if (notpending) {
      res.status(409).json({"error":"can't refuse request if no request in first place"});
      return ;
    }
    await this.userService.remove_pending(user_1.login42, user_1.pending, user_2.login42);
    res.json({"success":`request refused between ${query.f1} and ${query.f2}`});
  }
  
  @Get('block_user')
  async blockUser(@Res() res:any, @Query() query: setFriendsDto) {
    console.log("%s blocks %s", query.f1, query.f2);
    if (query.f1 == query.f2) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
      return ;
    }
    const user_1 = await this.userService.findUsername(query.f1);
    const user_2 = await this.userService.findUsername(query.f2);
    if (user_1 == null || user_2 == null) {
      res.status(409).json({"error":`no user with such username`});
      return ;
    }
    let alreadyblocked: boolean = false;
    for (let pending of user_1.blocked_users) {
      if (pending == user_2.login42) {
        alreadyblocked = true;
        break ;
      }
    }
    if (alreadyblocked) {
      res.status(409).json({"error":"can't block if blocked in first place"});
      return ;
    }
    await this.userService.block_user(user_1.login42, user_1.blocked_users, user_2.login42);
    res.json({"success":`${query.f1} blocked ${query.f2}`});
  }
  
  @Get('unblock_user')
  async unblockUser(@Res() res:any, @Query() query: setFriendsDto) {
    console.log("%s unblocks %s", query.f1, query.f2);
    if (query.f1 == query.f2) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
      return ;
    }
    const user_1 = await this.userService.findUsername(query.f1);
    const user_2 = await this.userService.findUsername(query.f2);
    if (user_1 == null || user_2 == null) {
      res.status(409).json({"error":`no user with such username`});
      return ;
    }
    let notpending: boolean = true;
    for (let pending of user_1.blocked_users) {
      if (pending == user_2.login42) {
        notpending = false;
        break ;
      }
    }
    if (notpending) {
      res.status(409).json({"error":"can't unblock if not blocked in first place"});
      return ;
    }
    await this.userService.unblock_user(user_1.login42, user_1.blocked_users, user_2.login42);
    res.json({"success":`${query.f1} unblocked ${query.f2}`});
  }
  
  @Get('set_friends')
  async setFriends(@Res() res:any, @Query() query: setFriendsDto) {
    console.log("setting friendship between %s and %s", query.f1, query.f2);
    if (query.f1 == query.f2) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
      return ;
    }
    const user_1 = await this.userService.findUsername(query.f1);
    const user_2 = await this.userService.findUsername(query.f2);
    if (user_1 == null || user_2 == null) {
      res.status(409).json({"error":`no user with such username`});
      return ;
    }
    for (let friend of user_1.friends) {
      if (friend == user_2.login42) {
        res.status(409).json({"error":"c'est déjà ton pote boloss"});
        return ;
      }
    }
    await this.userService.add_friend(user_1.login42, user_1.friends, user_2.login42);
    await this.userService.add_friend(user_2.login42, user_2.friends, user_1.login42);
    res.json({"success":`friendship blooming between ${query.f1} and ${query.f2}`});
  }
  
  @Get('unset_friends')
  async unsetFriends(@Res() res:any, @Query() query: setFriendsDto) {
    console.log("unsetting friendship between %s and %s", query.f1, query.f2);
    if (query.f1 == query.f2) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
      return ;
    }
    const user_1 = await this.userService.findUsername(query.f1);
    const user_2 = await this.userService.findUsername(query.f2);
    if (user_1 == null || user_2 == null) {
      res.status(409).json({"error":`no user with such username`});
      return ;
    }
    let notfriends: boolean = true;
    for (let friend of user_1.friends) {
      if (friend == user_2.login42) {
        notfriends = false;
        break ;
      }
    }
    if (notfriends) {
      res.status(409).json({"error":"can't unset friend if not friends in first place"});
      return ;
    }
    await this.userService.remove_friend(user_1.login42, user_1.friends, user_2.login42);
    await this.userService.remove_friend(user_2.login42, user_2.friends, user_1.login42);
    res.json({"success":`friendship sunk between ${query.f1} and ${query.f2}`});
  }
  
  @Get('get')
    async getUser(@Res() res: any) {
      console.log("got get request");
    const messages = await this.userService.findAll();
    res.json(messages);
  }
  
  @Get('add')
  async addUser(@Res() res: any, @Query() query: newUserDto) {
    console.log("got from query: %s as login42 and %s as username", query.login42, query.username);
    const check_base = await this.userService.findOne(query.login42);
    if (check_base != null) {
      res.status(409).json({"user":"already exists"});
      return ;
    }
    const nUser: User = new User;
    nUser.login42 = query.login42;
	  nUser.username = query.username;
    await this.userService.createUser(nUser);
    res.json({"user":"created"});
  }
  
  @Get('delAll')
  async delAll(@Res() res: any) {
    const users = await this.userService.findAll();
    for (let user of users) {
      await this.userService.remove(user.username);
    }
    res.json({"users":"deleted"});
  }
  
  @Get('del:username')
  async delUser(@Res() res: any, @Param() params: any) {
    const username: string = params.username.slice(1);
    console.log("got del request with username %s", username);
    const current_user = await this.userService.findUsername(username);
    if (current_user == null) {
      res.status(409).json({"user":"doesn't exist"});
      return ;
    }
    for (let friend of current_user.friends) {
      const other = await this.userService.findOne(friend);
      if (other != null) {
        await this.userService.remove_friend(current_user.login42, current_user.friends, other.login42);
        await this.userService.remove_friend(other.login42, other.friends, current_user.login42);
        console.log(`friendship sunk between ${current_user.username} and ${other.username}`);
      }
    }
    await this.userService.remove(username);
    res.json({"user":"deleted"});
  }
}

// @Get("connect")
// async connect(@Res() res: any, @Query() query: connectUserDto) {
//   console.log("trying connection: %s as username and %s as password", query.username, query.password);
//   const user = await this.userService.findUserName(query.username);
//   if (user == null) {
// 	  res.json({"error":"user doesn't exists"});
// 	  return ;
//   } else if (user.password != query.password) {
// 	  res.json({"error":"bad password"});
// 	  return ;
//   }
//   res.json({"connection":"successful"});
// }