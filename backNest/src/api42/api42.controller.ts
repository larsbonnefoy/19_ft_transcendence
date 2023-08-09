import { Controller, Get, Res, Query, Body, Post} from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { Response } from 'express';
import { Api42Service } from './api42.service';
// import { Api42 } from './api42.interface';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import * as cookieParser from 'cookie-parser';
import { jwtDto } from './jwtDto.dto';
@Controller('api42')
export class Api42Controller {
	constructor(private api42Service: Api42Service){}

	@Get('getToken')
	async findAll(	@Body() signInDto: Record<string, any>, @Query('code') query: string) 
	{
		console.log("getIntraInfos");

		const access_token  : string = await this.api42Service.getToken(query);
		const intraLogin : string = await this.api42Service.getLogin42(access_token);
		const intraPhoto : string = await this.api42Service.getImage42(access_token);	 
		const jwtToken : string = await this.api42Service.createJWT(intraLogin);
		console.log(jwtToken)
		return jwtToken; 
	}
	
	@Post('isAuth')
	isAuth(@Body() jwtDto: jwtDto ) {
		return this.api42Service.isAuth(jwtDto.token);
	}
}