import { Module } from '@nestjs/common';
import { Api42Service } from './api42.service';
import { ConfigModule } from '@nestjs/config';

@Module(
		{  
			imports: [HttpModule],
			imports: [ConfigModule.forRoot()],
 	 		providers: [CatsService, Api42Service],
		}
	)
export class Api42Module {}
