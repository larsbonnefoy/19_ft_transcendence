import { Module } from '@nestjs/common';
import { Api42Service } from './api42.service';
import { ConfigModule } from '@nestjs/config';
import { Api42Controller } from './api42.controller';
import { HttpModule } from '@nestjs/axios';
import { Axios, AxiosResponse } from 'axios';
import * as cookieParser from 'cookie-parser';

@Module(
		{  
			imports: [Axios, HttpModule, ConfigModule.forRoot()],
 	 		providers: [Api42Service],
 	 		controllers: [Api42Controller],
		}
	)
export class Api42Module {}
