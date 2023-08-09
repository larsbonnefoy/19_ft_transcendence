
import { Controller, Get, Post, Param, Query, ParseIntPipe, ParseUUIDPipe, Res } from '@nestjs/common';
// import { IsInt, IsString } from 'class-validator';
// import { identity } from 'rxjs';
import { AppService } from './app.service';

// class GetParamType{
//   @IsInt()
//   id: number;

//   @IsString()
//   name: string;
// }


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get()
  getHello() {
	console.log("Hello World!");
	return this.appService.getHello();
  }

  @Get(":name")
  getDefault(@Param() params: any, @Query('id', ParseIntPipe) id: Number): object {
    console.log("in default controller with name %s and id %d", params.name, id);
    return this.appService.getJSON(params.name, id);
  }

}
