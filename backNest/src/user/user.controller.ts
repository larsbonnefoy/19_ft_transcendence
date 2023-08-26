import { Controller, Get, Post, Param, Query, ParseIntPipe, ParseUUIDPipe, Res, forwardRef, Inject, UseGuards, Request, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { Api42Service } from '../api42/api42.service';
import { AuthGuard } from '../guard/auth.guard';
// import { IsInt, IsString } from 'class-validator';
// import { identity } from 'rxjs';

import { User, UserStatus } from './user.entity';
import { UserService } from './user.service';
import { newUserDto } from './userDto.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller("user")
export class UserController {
  constructor(@Inject(forwardRef(() => Api42Service)) private  api42Service: Api42Service, private readonly userService: UserService) {}

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

  @UseGuards(AuthGuard)
  @Get('setStatus:status')
  async SetStatusFromLogin(@Request() req: any, @Res() res: Response, @Param() param: any) {
    const status: number = +param.status.slice(1);
    if (status < 0 || status > 2) {
      res.status(409).json({"error":"status must be 0 1 2"});
      return ;
    }
    const user = await this.userService.findOne(req.user);
    if (user == null) {
      res.status(409).json({"error":"no user with that login"});
      return ;
    }
    console.info("%s is now %s", req.user, UserStatus[status]);
    await this.userService.set_status(req.user, UserStatus[status]);
    res.json({"success":`status changed from ${user.status} to ${UserStatus[status]}`});
  }
 
  @UseGuards(AuthGuard)
  @Get('me')
  async getMyself(@Request() req: any, @Res() res: any) {
    const user: User = await this.userService.findOne(req.user);
    console.log("got myself from %s", user.username);
    res.json(user);
  }

  @Get('one:username')
  async getOneUser(@Res() res: any, @Param() params: any) {
    const username: string = params.username.slice(1);
    console.log("got request for user with username %s", username);
    let messages: User = await this.userService.findUsername(username);
    // messages.twofaSecret = null;
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

  @UseGuards(AuthGuard)
  @Get('change_username:new')
  async changeUsername(@Request() req: any, @Res() res: any, @Param() param: any) {
    const newUsername: string = param.new.slice(1);
    const sessionId : string = req.user;
    // console.log("trest : " + sessionId);

    console.log("changing username of %s to %s", sessionId, newUsername);
    const current_user = await this.userService.findOne(sessionId);
    if (current_user == null) {
      res.status(409).json({"error":`no user with ${sessionId} as login42`});
      return ;
    }
    if (current_user.username == newUsername) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
      return ;
    }
    const check_base = await this.userService.findUsername(newUsername);
    if (check_base != null) {
      res.status(409).json({"error":`username ${newUsername} already taken`});
      return ;
    }
    await this.userService.change_username(current_user.login42, newUsername);
    res.json({"success":`username of ${sessionId} changed to ${newUsername}`});
  }

  @UseGuards(AuthGuard)
  @Get('add_friend:username')
  async addFriend(@Request() req: any, @Res() res: any, @Param() param: any) {
    const friendusername: string = param.username.slice(1);
    const user_1 = await this.userService.findOne(req.user);
    const user_2 = await this.userService.findUsername(friendusername);
    if (user_1 == null || user_2 == null) {
      res.status(409).json({"error":`no user with such username`});
      return ;
    }
    console.log("%s sends friend request to %s", user_1.username, friendusername);
    if (user_1.username == friendusername) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
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
    res.json({"success":`${user_1.username} sent friend request to ${friendusername}`});
  }
  
  @UseGuards(AuthGuard)
  @Get('remove_request:username')
  async removeRequest(@Request() req: any, @Res() res: any, @Param() param: any) {
    const friendusername: string = param.username.slice(1);
    const user_1 = await this.userService.findOne(req.user);
    const user_2 = await this.userService.findUsername(friendusername);
    if (user_1 == null || user_2 == null) {
      res.status(409).json({"error":`no user with such username`});
      return ;
    }
    console.log("%s removes friend request towards %s", user_1.username, friendusername);
    if (user_1.username == friendusername) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
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
    res.json({"success":`${user_1.username} withdrew friend request to ${friendusername}`});
  }
  
  @UseGuards(AuthGuard)
  @Get('accept_request:username')
  async acceptRequest(@Request() req: any, @Res() res: any, @Param() param: any) {
    const friendusername: string = param.username.slice(1);
    const user_1 = await this.userService.findOne(req.user);
    const user_2 = await this.userService.findUsername(friendusername);
    if (user_1 == null || user_2 == null) {
      res.status(409).json({"error":`no user with such username`});
      return ;
    }
    console.log("%s accepts %s friend request", user_1.username, friendusername);
    if (user_1.username == friendusername) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
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
      res.status(409).json({"error":"can't accept request if no request in first place"});
      return ;
    }
    await this.userService.remove_pending(user_1.login42, user_1.pending, user_2.login42);
    await this.userService.add_friend(user_1.login42, user_1.friends, user_2.login42);
    await this.userService.add_friend(user_2.login42, user_2.friends, user_1.login42);
    res.json({"success":`friendship blooming between ${user_1.username} and ${friendusername}`});
  }
  
  @UseGuards(AuthGuard)
  @Get('refuse_request:username')
  async refuseRequest(@Request() req: any, @Res() res: any, @Param() param: any) {
    const friendusername: string = param.username.slice(1);
    const user_1 = await this.userService.findOne(req.user);
    const user_2 = await this.userService.findUsername(friendusername);
    if (user_1 == null || user_2 == null) {
      res.status(409).json({"error":`no user with such username`});
      return ;
    }
    console.log("%s refuses %s friend request", user_1.username, friendusername);
    if (user_1.username == friendusername) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
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
    res.json({"success":`request refused between ${user_1.username} and ${friendusername}`});
  }
  
  @UseGuards(AuthGuard)
  @Get('block_user:username')
  async blockUser(@Request() req: any, @Res() res: any, @Param() param: any) {
    const friendusername: string = param.username.slice(1);
    const user_1 = await this.userService.findOne(req.user);
    const user_2 = await this.userService.findUsername(friendusername);
    if (user_1 == null || user_2 == null) {
      res.status(409).json({"error":`no user with such username`});
      return ;
    }
    console.log("%s blocks %s", user_1.username, friendusername);
    if (user_1.username == friendusername) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
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
    res.json({"success":`${user_1.username} blocked ${friendusername}`});
  }
  
  @UseGuards(AuthGuard)
  @Get('unblock_user:username')
  async unblockUser(@Request() req: any, @Res() res: any, @Param() param: any) {
    const friendusername: string = param.username.slice(1);
    const user_1 = await this.userService.findOne(req.user);
    const user_2 = await this.userService.findUsername(friendusername);
    if (user_1 == null || user_2 == null) {
      res.status(409).json({"error":`no user with such username`});
      return ;
    }
    console.log("%s unblocks %s", user_1.username, friendusername);
    if (user_1.username == friendusername) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
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
    res.json({"success":`${user_1.username} unblocked ${friendusername}`});
  }
  
  @UseGuards(AuthGuard)
  @Get('set_friends:username')
  async setFriends(@Request() req: any, @Res() res:any, @Param() param: any) {
    const friendusername: string = param.username.slice(1);
    const user_1 = await this.userService.findOne(req.user);
    const user_2 = await this.userService.findUsername(friendusername);
    if (user_1 == null || user_2 == null) {
      res.status(409).json({"error":`no user with such username`});
      return ;
    }
    console.log("setting friendship between %s and %s", user_1.username, friendusername);
    if (user_1.username == friendusername) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
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
    res.json({"success":`friendship blooming between ${user_1.username} and ${friendusername}`});
  }
  
  @UseGuards(AuthGuard)
  @Get('unset_friend:username')
  async unsetFriends(@Request() req: any, @Res() res:any, @Param() param: any) {
    const friendusername: string = param.username.slice(1);
    const user_1 = await this.userService.findOne(req.user);
    const user_2 = await this.userService.findUsername(friendusername);
    if (user_1 == null || user_2 == null) {
      res.status(409).json({"error":`no user with such username`});
      return ;
    }
    console.log("unsetting friendship between %s and %s", user_1.username, friendusername);
    if (user_1.username == friendusername) {
      res.status(409).json({"error":"c'est déjà toi boloss."});
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
    res.json({"success":`friendship sunk between ${user_1.username} and ${friendusername}`});
  }
  
  @Get('get')
    async getUser(@Res() res: any) {
      console.log("got get request");
    const messages = await this.userService.findAll();
    res.json(messages);
  }

  @Get('getLeaderBoard')
    async getLeaderBoard(@Res() res: any) {
    const LeaderBoardInfo = await this.userService.getLeaderboard();
    res.json(LeaderBoardInfo);
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

  @UseGuards(AuthGuard)
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@Request() req: any, @UploadedFile(
	new ParseFilePipe({
	  validators: [
		new MaxFileSizeValidator({ maxSize: 500000 }),
		new FileTypeValidator({ fileType: 'image/*' }),
	  ],
	}),) file : Express.Multer.File) {
		console.log("uploading file on user %s: ", req.user);
		console.log(file);
		const user: User = await this.userService.findOne(req.user);
		fs.unlink("uploads/" + user.photo, (err) => {
			if (err) 
				console.log(err);
			else
				console.log('%s was deleted', "uploads/" + user.photo);
		});
		await this.userService.change_avatar(req.user, file.filename);
  }

  @Get('avatar:imgpath')
  seeUploadedAvatar(@Res() res: Response, @Param('imgpath') image: any) {
	console.log("get for image %s", image.slice(1));
	res.sendFile(image.slice(1), {root: 'uploads'});
  }
}
