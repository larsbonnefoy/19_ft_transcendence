import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';

@WebSocketGateway(
    {
      cors: {
        origin: ["http://10.2.7.2:5173", "http://localhost:5173"],
        methods: ["GET", "POST"],
      },
    })
export class AchievementGateway {
  constructor() {}
  
  @WebSocketServer()
  server: Server;
}
