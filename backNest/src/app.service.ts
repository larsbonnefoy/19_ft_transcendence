import { Injectable } from '@nestjs/common';
import { Api42Module } from 'api42/api42.module';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! - from backnest';
  }
  getJSON(name:string, id:Number): object {
    return {"message":"Succesfully got request","ViewedPage":name,"RequestNumber":id};
  }
  getApi(): Observable<AxiosResponse<Api42[]>>
  {
	return await NestFactory.create(Api42Module); 
  }
}
