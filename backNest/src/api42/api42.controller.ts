import { Controller, Get, Res, Query } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { Response } from 'express';
import { Api42Service } from './api42.service';
// import { Api42 } from './api42.interface';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import * as cookieParser from 'cookie-parser';

@Controller('api42')
export class Api42Controller {
	constructor(private api42Service: Api42Service){}

	@Get('getToken')
	async findAll(@Res({ passthrough: true }) response: Response, @Query('code') query: string) 
	{
		console.log("ayo");

		response.cookie('access_token', query['access_token']);
		// response.header("test", "test");
		const apiJSON : string = await this.api42Service.getToken(query);
		console.log(response.json());	
		return apiJSON;
	}

}
