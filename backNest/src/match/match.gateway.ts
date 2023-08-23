import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
  } from '@nestjs/websockets';
  import { Res } from '@nestjs/common';
  import { from, Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { Server } from 'socket.io';
  import { Response } from 'express';

  
  @WebSocketGateway({
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
//      allowedHeaders: ["my-custom-header"],
//      credentials: true
    },
  })
  export class MatchGateway {
    @WebSocketServer()
    server: Server;
  
    @SubscribeMessage('events')
    findAll(@MessageBody() data: any): any /*Observable<WsResponse<number>>*/ {
        console.log("got message: " + data);
      //return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
      //res.json({"test": "salut"});
      this.server.emit("events", data);
      return data;
    }
  
    @SubscribeMessage('identity')
    async identity(@MessageBody() data: number): Promise<number> {
      return data;
    }
    
    @SubscribeMessage('leftPaddle')
    async computeLeftPaddle(@MessageBody() data: any) {
        console.log("leftPaddle: " + data.pos);
        if (data.pos > data.max) {
            data.pos = data.max;
        } else if (data.pos < data.min) {
            data.pos = data.min;
        }
        this.server.emit("leftPaddle", data.pos);
    }

  }