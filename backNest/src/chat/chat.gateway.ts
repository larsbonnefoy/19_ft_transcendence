import { forwardRef, Inject } from '@nestjs/common';
import {
  ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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

  @SubscribeMessage('sendPrivate')
  handleMessage(@MessageBody()  data: {target: string, message: string, token: string}) {
  let login42: string = "";
    try {
      login42 = this.api42Service.decodeJWT(data.token);
    }
    catch (error) {
      return ;
    }
  this.server.to(data.target).emit("privateMessage", {message: data.message, login: login42});
  }

}
