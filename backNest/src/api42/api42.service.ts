import { Injectable, Req, Query, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class Api42Service 
{
	constructor(
		private readonly httpService: HttpService,
		@Inject(forwardRef(() => UserService))
		private usersService: UserService,
		private jwtService: JwtService
		) {}

	async getToken(query : string) : Promise<string>
		{
			// console.log("query : ");
			// console.log(query);
			// console.error(process.env.JWT_SECRET);
			// console.log(`http://${process.env.LOCAL_IP}:${process.env.VUE_PORT}/auth`)
		try
		{
			const response  = await this.httpService.axiosRef.post('https://api.intra.42.fr/oauth/token', {
					grant_type: 'authorization_code',
					client_id: process.env.API_UID,
					client_secret: process.env.API_SECRET,
					code: query,
					redirect_uri: `http://${process.env.LOCAL_IP}:${process.env.VUE_PORT}/auth`,
	  			}, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
			// console.log("access_token");
			// console.log(response.data['access_token'])
			return (response.data["access_token"])
		}
		catch (error){
			console.log(error)
			throw "getTokenError" ;

		}
	}

	async getLogin42(access_token : string) : Promise<string>
	{
		// console.log("fetch login42");
		try
		{
			const userInfo = await this.httpService.axiosRef.get(`https://api.intra.42.fr/v2/me?access_token=${access_token}`);
			// console.log(userInfo.data['login']);
			// console.log("getlogin: ended");
			return (userInfo.data['login']);
		}
		catch
		{
			throw "getLogin42Error";
		}
	}

	async getImage42(access_token : string) : Promise<string>
	{
		// console.log("fetch photo42");
		try
		{
			const userInfo = await this.httpService.axiosRef.get(`https://api.intra.42.fr/v2/me?access_token=${access_token}`);
			// console.log(userInfo.data['image']['versions']['large']);
			// console.log("getImage : ended");
			return (userInfo.data['image']['versions']['large']);
		}
		catch
		{
			throw "getImage42Error";
		}
	}

	async createJWT(login42 : string, state: boolean) : Promise<any>
	{
		const payload = {sub : login42, auth: state}
		return {
			jwt_token: await this.jwtService.signAsync(payload),
		};
	}

	async isAuth(jwtToken : string) : Promise<boolean>
	{
		try {
			//console.error(process.env.JWT_SECRET);
			const payload = await this.jwtService.verifyAsync(
				jwtToken,
				{
					secret: process.env.JWT_SECRET
				}
			);
		if (!payload['auth'] || payload['auth'] === false)
			return false;
		} 
		catch (error) {
			console.log(error);
			return false;
		}
		return true;
	}

	decodeJWT(jwtToken : string) : string | null
	{
		try {
			const decoded : any = this.jwtService.decode(jwtToken);
			// console.log('decoded');
			// console.log(jwtToken);
			// console.log(decoded);
			return (decoded['sub']);
		}
		catch
		{
			throw "decodeJWTErrror";
		}
	}

	async setUserName(login42 : string) : Promise<string>
	{
		let res : string = login42;
		let i : number = 1
		while (await this.usersService.findUsername(res) != null)
		{
			res = login42 + i;
			// console.log(res);
			i++;
		}
		return res;
	}

}