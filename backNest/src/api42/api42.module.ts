import { Module } from '@nestjs/common';
import { Api42Service } from './api42.service';
import { ConfigModule } from '@nestjs/config';
import { Api42Controller } from './api42.controller';
import { HttpModule } from '@nestjs/axios';
import { Axios, AxiosResponse } from 'axios';
import * as cookieParser from 'cookie-parser';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';

@Module(
		{  
			imports: [Axios, HttpModule, ConfigModule.forRoot(), UserModule, 
				JwtModule.register(
				{
					global: true,
					secret: jwtConstants.secret,
					signOptions: { expiresIn: '60s' },
				}
				)
			],
 	 		providers: [Api42Service],
 	 		controllers: [Api42Controller],
		}
	)
export class Api42Module {}
