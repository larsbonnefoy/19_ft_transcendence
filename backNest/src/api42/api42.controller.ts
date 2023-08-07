import { Controller, Get, Req, Query } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { Api42Service } from './api42.service';
// import { Api42 } from './api42.interface';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Controller('api42')
export class Api42Controller {
	constructor(private api42Service: Api42Service){}

	@Get('getToken')
	async findAll(@Query('code') query: string) 
	{
		console.log("ayo");

		const apiJSON : string = await this.api42Service.getToken(query);

		return apiJSON;
	}

}
