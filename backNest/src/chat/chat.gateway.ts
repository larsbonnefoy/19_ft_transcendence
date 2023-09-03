import { forwardRef, Inject } from '@nestjs/common';
import {
  ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Api42Service } from '../api42/api42.service';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';

@WebSocketGateway(
  {
    cors: {
      origin: [`http://${process.env.LOCAL_IP}:5173`, "http://localhost:5173"],
      methods: ["GET", "POST"],
    },
  })
export class ChatGateway {
  constructor(@Inject(forwardRef(() => Api42Service)) private  api42Service: Api42Service, private  chatService: ChatService, private readonly userService: UserService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('send')
  handleMessage(@MessageBody()  data: {target: string, message: string, token: string}) {
  let login42: string = "";
    try {
      login42 = this.api42Service.decodeJWT(data.token);
    }
    catch (error) {
      return ;
    }
  this.server.to("channel" + data.target).emit("getMessage", {message: data.message, login: login42});
  }

  @SubscribeMessage('joinChannel')
  joinChannel(@ConnectedSocket() client: any, @MessageBody()  data: {target: string, token: string})
  {
    client.join("channel" + data.target);
    console.log("client joined : channel" + data.target)
  }

  @SubscribeMessage('leaveChannel')
  leaveChannel(@ConnectedSocket() client: any, @MessageBody()  data: {target: string, token: string})
  {
    client.leave("channel" + data.target);
    console.log("client left : channel" + data.target)
  }
}