import { Controller, Get, Res, Query, Body, Post, Param, UnauthorizedException} from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { Response } from 'express';
import { Api42Service } from './api42.service';
// import { Api42 } from './api42.interface';
import { AxiosResponse } from 'axios';
import { jwtDto, login42 } from './apiDto.dto';
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
		// console.log('decode: ');
		// console.log(this.api42Service.decodeJWT(jwtToken['jwt_token']));
		return jwtToken;
	}
	
	@Post('isAuth')
	isAuth(@Body() jwtDto: jwtDto ) {
		return this.api42Service.isAuth(jwtDto.token);
	}

	@Post('getLoggedUser')
	async getLoggedUser(@Body() jwtDto: jwtDto )
	{
		const login42 : string = this.api42Service.decodeJWT(jwtDto.token);//decode JWT only returns the user login;
		return this.userService.findOne(login42);
	}


	/*
		Function that returns a JWT token for the given login42 given.
		Login with any account and bypass 42auth
	*/
	@Get('admin')
	async adminLog(@Query() query: login42) {
		if (query.login42) {
			const jwtToken : string = await this.api42Service.createJWT(query.login42);
			return jwtToken;
		}
		else {
			return {jtw_token : "unvalid"};
		}
	}
}