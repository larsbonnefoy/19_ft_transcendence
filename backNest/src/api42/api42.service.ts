import { Injectable, Req, Query, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { jwtConstants } from './constant';

@Injectable()
export class Api42Service 
{
	constructor(
		private readonly httpService: HttpService,
		private usersService: UserService,
		private jwtService: JwtService
		) {}

	async getToken(query : string) : Promise<string>
		{
			console.log("query : ");
			console.log(query);
		try
		{
			const response  = await this.httpService.axiosRef.post('https://api.intra.42.fr/oauth/token', {
					grant_type: 'authorization_code',
					client_id: process.env.API_UID,
					client_secret: process.env.API_SECRET,
					code: query,
					redirect_uri: 'http://localhost:5173/auth'
	  			}, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
			console.log("access_token");
			console.log(response.data['access_token'])
			return (response.data["access_token"])
		}
		catch {
			return ;
		//TODO manage errors

		}
	}

	async getLogin42(access_token : string) : Promise<string>
	{
		console.log("fetch login42");
		try
		{
			const userInfo = await this.httpService.axiosRef.get(`https://api.intra.42.fr/v2/me?access_token=${access_token}`);
			console.log(userInfo.data['login']);
			console.log("getlogin: ended");
			return (userInfo.data['login']);
		}
		catch
		{
			return ;//TODO CATCH HTTP ERROR CODE AND SHOW SOME ERROR MESSAGE TO THE USER ft_delog
		};
		//TODO manage errors
	}

	async getImage42(access_token : string) : Promise<string>
	{
		console.log("fetch photo42");
		try
		{
			const userInfo = await this.httpService.axiosRef.get(`https://api.intra.42.fr/v2/me?access_token=${access_token}`);
			console.log(userInfo.data['image']['versions']['large']);
			console.log("getImage : ended");
			return (userInfo.data['image']['versions']['large']);
		}
		catch
		{
			return ;//TODO CATCH HTTP ERROR CODE AND SHOW SOME ERROR MESSAGE TO THE USER ft_delog
		}
		//TODO manage errors
		}

	async createJWT(login42 : string) : Promise<any>
	{
		const payload = {sub : login42}
		return {
			jwt_token: await this.jwtService.signAsync(payload),
		};
	}

	async isAuth(jwtToken : string) : Promise<boolean>
	{
		try {
			const payload = await this.jwtService.verifyAsync(
				jwtToken,
				{
					secret: jwtConstants.secret
				}
			);
		} 
		catch {
			return false;
		}
		return true;
	}
	
	decodeJWT(jwtToken : string) : string | null
	{
		try {
			const decoded : any = this.jwtService.decode(jwtToken);
			console.log('decoded');
			console.log(jwtToken);
			console.log(decoded);
			return (decoded['sub']);
		}
		catch
		{
			return null;
		}
	}

}