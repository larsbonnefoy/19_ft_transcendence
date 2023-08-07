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
		// https://api.intra.42.fr//oauth/token
		// client_credentials
		// const req : Response = await fetch('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-2f106f36bdac3ac02f5555c178177423c9af72f59dc797d1fd439cdec8ca9985&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi42&response_type=code');
		// const tmp : string = req.url;
		// return (tmp);
		// console.log(tmp);
		console.log(query);
		const response : string = await this.httpService.axiosRef.post('https://api.intra.42.fr/oauth/token', {
				// grant_type: 'client_credentials',
				grant_type: 'authorization_code',
				client_id: process.env.API_UID,
				client_secret: process.env.API_SECRET,
				code: query,
				redirect_uri: 'http://localhost:3000/api42'
  			}, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(response){
		// console.log(response.data)
		return (response.data);
	}).catch(function(error){
		console.log(error)
		return(error)
	});
	// const res : JSON = await response
	const res : string = response;
	console.log(res);
	// console.log(res["access_token"]);
	// const access_token : string = res["access_token"];

	return (res);
	}
}

