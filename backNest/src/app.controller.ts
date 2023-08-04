import { Controller, Get, Post, Param, Query, ParseIntPipe, ParseUUIDPipe, Res } from '@nestjs/common';
// import { IsInt, IsString } from 'class-validator';
// import { identity } from 'rxjs';
import { AppService } from './app.service';

import { User } from './user.entity';
import { UserService } from './user.service';
import { newUserDto } from './newUserDto.dto';

// class GetParamType{
//   @IsInt()
//   id: number;

//   @IsString()
//   name: string;
// }


@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly userService: UserService) {}

  @Get(":name")
  getHello(@Param() params: any, @Query('id', ParseIntPipe) id: Number): object {
    console.log("in default controller with name %s and id %d", params.name, id);
    return this.appService.getJSON(params.name, id);
  }
  
  @Get('/user/get')
  async User(@Res() res: any) {
    const messages = await this.appService.getUsers();
    res.json(messages);
  }
  
  @Get('/user/add')
  async nUser(@Res() res: any, @Query() query: newUserDto) {
    console.log("got from query: %s as name and %s as password", query.name, query.password);
    const nUser: User = new User;
    nUser.name = query.name;
    nUser.password = query.password;
    await this.appService.createUser(nUser);
    res.json({"user":"created"});
  }
  
  @Get('/user/del')
  async delUser(@Res() res: any, @Query('id', ParseIntPipe) id: number) {
    this.userService.remove(id);
    res.json({"user":"deleted"});
  }
  

}
