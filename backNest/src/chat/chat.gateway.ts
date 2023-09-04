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
import { User } from '../user/user.entity';
import { Api42Service } from '../api42/api42.service';
import { UserService } from '../user/user.service';
import { Chat } from './chat.entity';
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
  async handleMessage(@MessageBody()  data: {target: number, message: string, token: string}) {
  let login42: string = "";
    try {
      login42 = this.api42Service.decodeJWT(data.token);
    }
    catch (error) {
      return ;
    }
  const current_user = await this.userService.findOne(login42);
  if (current_user === null)
    return ; // should not happen but you never know
  const chatUsers: User[] = await this.chatService.getUsers(data.target);
  console.log(chatUsers);
  for (let user of chatUsers) {
    if (user.login42 !== login42) {
      console.log("sending toast to " + user.login42);
      this.server.to(user.login42).emit('messageToast', {from: current_user.username, message: data.message});
    }
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