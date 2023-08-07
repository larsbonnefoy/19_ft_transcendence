import { Controller, Get, Post, Param, Query, ParseIntPipe, ParseUUIDPipe, Res } from '@nestjs/common';
// import { IsInt, IsString } from 'class-validator';
// import { identity } from 'rxjs';

import { User } from './user.entity';
import { UserService } from './user.service';
import { newUserDto } from './userDto.dto';
import { connectUserDto } from './userDto.dto';
// import { check } from 'prettier';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get('one:name')
  async getOneUser(@Res() res: any, @Param() params: any) {
    console.log("got request for user with name %s", params.name.slice(1));
    const messages = await this.userService.findOne(params.name.slice(1));
    res.json(messages);
  }
  
  @Get('get')
  async getUser(@Res() res: any) {
	console.log("got get request");
    const messages = await this.userService.findAll();
    res.json(messages);
  }

  @Get('add')
  async addUser(@Res() res: any, @Query() query: newUserDto) {
	console.log("got from query: %s as name, %s as username and %s as password", query.name, query.username, query.password);
	const check_base = await this.userService.findOne(query.name);
	if (check_base != null) {
		res.json({"user":"already exists"});
		return ;
	}
    const nUser: User = new User;
    nUser.name = query.name;
	nUser.username = query.username;
    nUser.password = query.password;
    await this.userService.createUser(nUser);
    res.json({"user":"created"});
  }

  @Get("connect")
  async connect(@Res() res: any, @Query() query: connectUserDto) {
	  console.log("trying connection: %s as username and %s as password", query.username, query.password);
	  const user = await this.userService.findUserName(query.username);
	  if (user == null) {
		  res.json({"error":"user doesn't exists"});
		  return ;
	  } else if (user.password != query.password) {
		  res.json({"error":"bad password"});
		  return ;
	  }
	  res.json({"connection":"successful"});
  }

  @Get('del')
  async delUser(@Res() res: any, @Query('id', ParseIntPipe) id: number) {
	console.log("got del request with id %d", id);
    this.userService.remove(id);
    res.json({"user":"deleted"});
  }
}
