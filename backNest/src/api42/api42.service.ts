import { Injectable } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Injectable()
export class Api42Service 
{
	constructor(private readonly httpService: HttpService) {}

	findAll(): Observable<AxiosResponse<Api42[]>> 
	{
    		return this.httpService.post('https://api.intra.42.fr/oauth/token',{
				grant_type: 'client_credentials',
				client_id: process.env.API_UID,
				client_secret: process.env.API_SECRET
			});
	}
}
}

