import { Controller, Get, Res, Query, Body, Post, forwardRef, Inject} from '@nestjs/common';
import { Api42Service } from './api42.service';
import { jwtDto } from './apiDto.dto';
import { login42 } from './apiDto.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Controller('api42')
export class Api42Controller {
	constructor(private api42Service: Api42Service, @Inject(forwardRef(() => UserService)) private userService : UserService){}

	@Get('getToken')
	async findAll(@Res({passthrough: true}) response, @Body() signInDto: Record<string, any>, @Query('code') query: string) 
	{
		console.log("getIntraInfos");
		try
		{
			const access_token  : string = await this.api42Service.getToken(query);
			// const access_token  : string = "badAccess";
			const intraLogin : string = await this.api42Service.getLogin42(access_token);
			let state : boolean = true;
			const user = (await this.userService.findOne(intraLogin)); 
		//create a User object 
			if (!user)
			{
				console.log("creating a db entry");
				const newUser : User  = new User;
				newUser.login42 = intraLogin;
				newUser.username = await this.api42Service.setUserName(intraLogin);
				let intraPhoto: string;
				try
				{
					intraPhoto = await this.api42Service.getImage42(access_token);
				}
				catch
				{
					intraPhoto = "https://media.tenor.com/YBa1MzJt-44AAAAd/haven-salamash.gif";
				}
				newUser.photo = intraPhoto;
				let hugocheck : string = intraLogin;
				hugocheck.toLowerCase();
				for (let i = 0; i < hugocheck.length - 3; i++) {
					if (hugocheck.slice(i, i + 4) === "hugo") {
						newUser.achievements = 256;
						break ;
					}
				}
				await this.userService.createUser(newUser);
			}
			else
			{
				if (user.has2fa === true)
					state = false;
				console.log("user already in the db");
			}
			const jwtToken : string = await this.api42Service.createJWT(intraLogin, state);
			console.log(jwtToken)
			return jwtToken;
		}
		catch (error)
		{
			response.status(500).send(error);//YOOOOOO
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
			const jwtToken : string = await this.api42Service.createJWT(query.login42, true);
			const user: User = new User;
			user.login42 = query.login42;
			user.username = query.login42;
			// user.photo = "https://media.tenor.com/YBa1MzJt-44AAAAd/haven-salamash.gif"
			await this.userService.createUser(user);
			return jwtToken;
		}
		else {
			return {jtw_token : "unvalid"};
		}
	}
}