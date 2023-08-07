import { Controller, Get, Post, Param, Query, ParseIntPipe, ParseUUIDPipe, Res } from '@nestjs/common';
// import { IsInt, IsString } from 'class-validator';
// import { identity } from 'rxjs';

import { User } from './user.entity';
import { UserService } from './user.service';
import { newUserDto } from './userDto.dto';
import { changeUsernameDto } from './userDto.dto';
// import { connectUserDto } from './userDto.dto';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get('one:username')
  async getOneUser(@Res() res: any, @Param() params: any) {
    const username: string = params.username.slice(1);
    console.log("got request for user with username %s", username);
    const messages = await this.userService.findUsername(username);
    res.json(messages);
  }
  
  @Get('addWin:username')
  async addWin(@Res() res: any, @Param() params: any) {
    const username: string = params.username.slice(1);
    console.log("increment win field for user with username %s", username);
    const current_user = await this.userService.findUsername(username);
    if (current_user == null) {
      res.json({"error":`no user with ${username} as username`});
      return ;
    }
    let wins:number = current_user.win;
    ++wins;
    await this.userService.addWin(current_user.loggin42, wins);
    res.json({"success":`${username} now has ${wins} wins`});
  }
  
  @Get('addLoss:username')
  async addLoss(@Res() res: any, @Param() params: any) {
    const username: string = params.username.slice(1);
    console.log("increment loss field for user with username %s", username);
    const current_user = await this.userService.findUsername(username);
    if (current_user == null) {
      res.json({"error":`no user with ${username} as username`});
      return ;
    }
    let loss:number = current_user.loss;
    ++loss;
    await this.userService.addLoss(current_user.loggin42, loss);
    res.json({"success":`${username} now has ${loss} loss`});
  }

  @Get('change_username')
  async changeUsername(@Res() res: any, @Query() query: changeUsernameDto) {
    console.log("changing username form %s to %s", query.old, query.new);
    if (query.old == query.new) {
      res.json({"error":"c'est déjà toi boloss."});
      return ;
    }
    const current_user = await this.userService.findUsername(query.old);
    if (current_user == null) {
      res.json({"error":`no user with ${query.old} as username`});
      return ;
    }
    const check_base = await this.userService.findUsername(query.new);
    if (check_base != null) {
      res.json({"error":`username ${query.new} already taken`});
      return ;
    }
    await this.userService.change_username(current_user.loggin42, query.new);
    res.json({"success":`username changed from ${query.old} to ${query.new}`});
  }

  @Get('get')
    async getUser(@Res() res: any) {
    console.log("got get request");
    const messages = await this.userService.findAll();
    res.json(messages);
  }

  @Get('add')
  async addUser(@Res() res: any, @Query() query: newUserDto) {
    console.log("got from query: %s as loggin42 and %s as username", query.loggin42, query.username);
    const check_base = await this.userService.findOne(query.loggin42);
    if (check_base != null) {
      res.json({"user":"already exists"});
      return ;
    }
    const nUser: User = new User;
    nUser.loggin42 = query.loggin42;
	  nUser.username = query.username;
    await this.userService.createUser(nUser);
    res.json({"user":"created"});
  }

  
  @Get('del')
  async delUser(@Res() res: any, @Query() loggin42: string) {
    console.log("got del request with loggin42 %d", loggin42);
    const check_base = await this.userService.findOne(loggin42);
    if (check_base == null) {
      res.json({"user":"doesn't exist"});
      return ;
    }
    this.userService.remove(loggin42);
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