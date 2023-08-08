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
				// grant_type: 'client_credentials',
				grant_type: 'authorization_code',
				client_id: process.env.API_UID,
				client_secret: process.env.API_SECRET,
				code: query,
				redirect_uri: 'http://localhost:5173/auth'
				// redirect_uri: 'http://localhost:3000/api42/getToken'
  			}, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(response){
		// console.log(response.data)
		return (response.data);
	}).catch(function(error){
		// console.log(error.data)
		// error.status = 401;
		return(error) //TODO CATCH HTTP ERROR CODE AND SHOW SOME ERROR MESSAGE TO THE USER ft_delog
	});
	// const res : JSON = await response
	// const res : string = response;
	// console.log(response);
	// console.log(res["access_token"]);
	// const access_token : string = res["access_token"];
	console.log("getToken : ended");
	return (response);
	}
}

