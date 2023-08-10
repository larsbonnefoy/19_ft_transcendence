import { Controller, Get, Res, Query, Body, Post} from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { Response } from 'express';
import { Api42Service } from './api42.service';
// import { Api42 } from './api42.interface';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import * as cookieParser from 'cookie-parser';
import { jwtDto } from './jwtDto.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Controller('api42')
export class Api42Controller {
	constructor(private api42Service: Api42Service, private userService : UserService){}

	@Get('getToken')
	async findAll(	@Body() signInDto: Record<string, any>, @Query('code') query: string) 
	{
		console.log("getIntraInfos");

		const access_token  : string = await this.api42Service.getToken(query);
		const intraLogin : string = await this.api42Service.getLogin42(access_token);
		const intraPhoto : string = await this.api42Service.getImage42(access_token);	 
		const jwtToken : string = await this.api42Service.createJWT(intraLogin);
		
		console.log(jwtToken)
		//create a User object 
		const user : User  = new User
		user.login42 = intraLogin;
		user.username = intraLogin;
		user.photo = intraPhoto;
		this.userService.createUser(user);
		return jwtToken;
		// const jsonString : string = "{ jwt_token: " + jwtToken['jwt_token'] +  " login42: " + intraLogin + "}";
		// return JSON.parse(jsonString); 
	}
	
	@Post('isAuth')
	isAuth(@Body() jwtDto: jwtDto ) {
		return this.api42Service.isAuth(jwtDto.token);
	}
}