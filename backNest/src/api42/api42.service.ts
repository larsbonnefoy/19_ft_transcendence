import { Injectable, Req, Query } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Api42Controller } from './api42.controller';
import { HttpService } from '@nestjs/axios';
import { Api42 } from './api42.interface';
import { Axios, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { request } from 'http';

@Injectable()
export class Api42Service 
{
	constructor(private readonly httpService: HttpService) {}

async getToken(query : string) : Promise<string>
	{
		console.log("query : ");
		console.log(query);
		const response : string = await this.httpService.axiosRef.post('https://api.intra.42.fr/oauth/token', {
				grant_type: 'authorization_code',
				client_id: process.env.API_UID,
				client_secret: process.env.API_SECRET,
				code: query,
				redirect_uri: 'http://localhost:5173/auth'
  			}, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(response){
		return (response.data);
	}).catch(function(error){
		// console.log(error.data)
		return(error) //TODO CATCH HTTP ERROR CODE AND SHOW SOME ERROR MESSAGE TO THE USER ft_delog
	});
	//TODO manage errors

	return (response["access_token"])
}

async getLogin42(access_token : string) : Promise<string>
{
	// const access_token : string = res["access_token"];
	console.log("fetch login42");
	const userInfo : string = await this.httpService.axiosRef.get(`https://api.intra.42.fr/v2/me?access_token=${access_token}`).then(function(response){
		return (response.data);
	}).catch(function(error){
		return(error) //TODO CATCH HTTP ERROR CODE AND SHOW SOME ERROR MESSAGE TO THE USER ft_delog
	});
	//TODO manage errors
	console.log(userInfo['login']);
	console.log("getlogin: ended");
	return (userInfo['login']);
}

async getImage42(access_token : string) : Promise<string>
{
	// const access_token : string = res["access_token"];
	console.log("fetch login42");
	const userInfo : string = await this.httpService.axiosRef.get(`https://api.intra.42.fr/v2/me?access_token=${access_token}`).then(function(response){
		return (response.data);
	}).catch(function(error){
		return(error) //TODO CATCH HTTP ERROR CODE AND SHOW SOME ERROR MESSAGE TO THE USER ft_delog
	});
	//TODO manage errors
	console.log(userInfo['image']['versions']['large']);
	console.log("getImage : ended");
	return (userInfo['image']['versions']['large']);
	}
}