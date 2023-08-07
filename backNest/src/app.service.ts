import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World! - from backnest';
  }
  getJSON(name:string, id:Number): object {
    return {"message":"Succesfully got request","ViewedPage":name,"RequestNumber":id};
  }
}
