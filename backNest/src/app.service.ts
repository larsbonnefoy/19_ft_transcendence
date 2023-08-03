import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! - from backnest';
  }
  getJSON(): object {
    return {"message":"Cannot GET /dsfs","error":"Not Found","statusCode":404};
  }
}
