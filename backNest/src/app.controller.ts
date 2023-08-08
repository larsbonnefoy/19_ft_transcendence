import { Controller, Get, Post, Param, Query, ParseIntPipe, Res } from '@nestjs/common';
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
  getyo(){
	console.log("yo");
  }
@Get(":name")
  getHello(@Param() params: any, @Query('id', ParseIntPipe) id: Number): object {
    console.log("in default controller with name %s and id %d", params.name, id);
    return this.appService.getJSON(params.name, id);
  }
}
