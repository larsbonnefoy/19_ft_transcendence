import { Controller, Get, Res, Query, Body, Post} from '@nestjs/common';
import { Api42Service } from './api42.service';
import { jwtDto } from './apiDto.dto';
import { login42 } from './apiDto.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Controller('api42')
export class Api42Controller {
	constructor(private api42Service: Api42Service, private userService : UserService){}

	@Get('getToken')
	async findAll(@Res({passthrough: true}) response, @Body() signInDto: Record<string, any>, @Query('code') query: string) 
	{
		console.log("getIntraInfos");
		try
		{
			const access_token  : string = await this.api42Service.getToken(query);
			// const access_token  : string = "badAccess";
			const intraLogin : string = await this.api42Service.getLogin42(access_token);
			const intraPhoto : string = await this.api42Service.getImage42(access_token);	 
			const jwtToken : string = await this.api42Service.createJWT(intraLogin);

			console.log(jwtToken)
		//create a User object 
			if (!(await this.userService.findOne(intraLogin)))
			{
				console.log("creating a db entry");
				const user : User  = new User
				user.login42 = intraLogin;
				user.username = await this.api42Service.setUserName(intraLogin);
				user.photo = intraPhoto;
				this.userService.createUser(user);
			}
			else
			{
				console.log("user already in the db");
			}
			return jwtToken;
		}
		catch (error)
		{
			response.status(500).send(error);
			console.error("api42/getToken error : " + error);
			return ;
		}	
	}
	
	@Post('isAuth')
	isAuth(@Body() jwtDto: jwtDto ) {
		return this.api42Service.isAuth(jwtDto.token);
	}

	@Post('getLoggedUser')
	async getLoggedUser(@Body() jwtDto: jwtDto, @Res({passthrough: true}) response)
	{
		try
		{
			const login42 : string = this.api42Service.decodeJWT(jwtDto.token);//decode JWT only returns the user login;
			return this.userService.findOne(login42);
		}
		catch (error)
		{
			console.error("api42/getLoggedUserError : " + error);
			response.status(500).send(error);
			return;
		}
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