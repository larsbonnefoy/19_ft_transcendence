import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';

@WebSocketGateway(
    {
      cors: {
    origin: [`http://${process.env.LOCAL_IP}:${process.env.VUE_PORT}`, `http://localhost:${process.env.VUE_PORT}`, `http://10.2.9.4:5173`],
        methods: ["GET", "POST"],
    //  allowedHeaders: ["Access-Control-Allow-Origin"],
     credentials: true
      },
    })
export class AchievementGateway {
  constructor() {}
  
  @WebSocketServer()
  server: Server;
}
