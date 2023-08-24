import {
  ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Res } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { Response } from 'express';
import { Game, states } from './match.entity';
import { RouterModule } from '@nestjs/core';
import { promises } from 'dns';

import { UserService } from '../user/user.service';
import { Match } from './match.entity';
import { MatchService } from './match.service';

const canvasWidth : number = 800;
const canvasHeight : number = 600;
const ballRadius : number = 10;
const ballSpeed : number = 10; //speed should be at least > 2

let games : Array<Game> = new Array(0);

@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
//      allowedHeaders: ["my-custom-header"],
//      credentials: true
  },
})
export class MatchGateway {
  constructor(private readonly userService: UserService, private readonly matchService: MatchService) {}

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
  async computeLeftPaddle(@MessageBody() data: {dir: number, roomName: string}) {
    for (let game of games)
    {
      if (game.roomName === data.roomName) {
        game.updateLeftPaddle(data.dir);
      } 
    }
  }

  @SubscribeMessage('rightPaddle')
  async computeRightPaddle(@MessageBody() data: {dir: number, roomName: string}) {
    for (let game of games)
    {
      if (game.roomName === data.roomName) {
        game.updateRightPaddle(data.dir);
      } 
    }
  }

  @SubscribeMessage('updatePaddle')
  async computePaddle(@MessageBody() data: {dir: number, roomName: string, user: string}) {
    for (let game of games)
    {
      if (game.roomName === data.roomName) {
        if (game.player0 === data.user)
          game.updateLeftPaddle(data.dir);
        else if (game.player1 === data.user)
          game.updateRightPaddle(data.dir);
      } 
    }
  }

  @SubscribeMessage('display')
  async display(@MessageBody() roomName: any) {
    // console.log("display update from room " + roomName);
    for (let game of games) {
      if (game.roomName === roomName) {
        // console.log("room found !");
        let save_state : states = game.state;
        game.updateGameArea(new Date().getTime());
        if (game.state === states.ENDED) {
          this.server.to(game.roomName).emit("endGame");
          if (save_state === states.ONGOING) {
            const nMatch: Match = new Match;
            const p1 = await this.userService.findUsername(game.player0);
            const p2 = await this.userService.findUsername(game.player1);
            if (p1 == null || p2 == null) {
              return ;
            }
            nMatch.player1 = p1.login42;
            nMatch.player2 = p2.login42;
            nMatch.score1 = game.score0;
            nMatch.score2 = game.score1;
            let expected_result:number = 1.0 / (1 + 10 ** ((p2.elo - p1.elo) / 400));
            if (+game.score0 > +game.score1) {
              await this.userService.addWin(p1.login42, +p1.win + 1);
              await this.userService.addLoss(p2.login42, +p2.loss + 1);
              let newelo1: number = +p1.elo + (1 - expected_result) * 16;
              await this.userService.change_elo(p1.login42, newelo1);
              let newelo2: number = +p2.elo - (1 - expected_result) * 16;
              await this.userService.change_elo(p2.login42, newelo2);
              nMatch.elo1 = Math.ceil(newelo1);
              nMatch.elo2 = Math.ceil(newelo2);
              console.log("player1 wins");
              console.log("formula gives %f, p1 gains %d", expected_result, (1 - expected_result) * 16);
            }
            else {
              await this.userService.addWin(p2.login42, +p2.win + 1);
              await this.userService.addLoss(p1.login42, +p1.loss + 1);
              let newelo1: number = +p1.elo - expected_result * 16;
              await this.userService.change_elo(p1.login42, +p1.elo - expected_result * 16);
              let newelo2: number = +p2.elo + expected_result * 16;
              await this.userService.change_elo(p2.login42, +p2.elo + expected_result * 16);
              nMatch.elo1 = Math.ceil(newelo1);
              nMatch.elo2 = Math.ceil(newelo2);
              console.log("player2 wins");
              console.log("formula gives %f, p1 loses %f", 1 - expected_result, expected_result * 16);
            }
            await this.matchService.createMatch(nMatch);
          }
        }
        else
          this.server.to(game.roomName).emit("display", game);
        return ;
      }
    }
  }

  // @SubscribeMessage('startGame')
  // async computeGame() {
  //     if (!game.ongoing) {
  //         game.ongoing = true;
  //         setInterval(updateGameArea, 20);
  //     }
  // }

  @SubscribeMessage('joinGame')
  async joinGame(@ConnectedSocket() client: any, @MessageBody() user: string) {
    console.log(client.id);
    let roomIndex: number = 0;
    let roomName: string = "";
    for (let game of games) {
      roomName = "room" + roomIndex;
      console.log(roomName);
      if (game.state === states.STARTING) {
        if (game.player0 === "") {
          game.player0 = user;
          client.join(roomName);
          console.log(user + ": user0 join room " + roomIndex);
          return ;
        } else if (game.player1 === "") {
          game.state = states.ONGOING;
          game.player1 = user;
          game.lastTimeStamp = new Date().getTime();
          client.join(roomName);
          this.server.to(roomName).emit("joinGame", roomName);
          console.log(user + ":user1 join room " + roomIndex);
          return ;
        }
      } else if (game.player0 === user || game.player1 === user) {
        client.join(roomName);
        this.server.to(roomName).emit("joinGame", roomName);
        return ;
      }
      ++roomIndex;
    }
    roomName = "room" + roomIndex;
    console.log(roomName);
    games.push(new Game())
    games[roomIndex].player0 = user;
    games[roomIndex].roomName = roomName;
    client.join(roomName);
    this.server.to(roomName).emit("joinGame", roomName);
    console.log("new game in array");
  }
  
  @SubscribeMessage('watchGame')
  async watchParty(@ConnectedSocket() client: any, @MessageBody() user: string) {
    for (let game of games)
    {
      if (game.player0 === user || game.player1 === user) {
        client.join(game.roomName);
        this.server.to(game.roomName).emit(game.roomName);
      }
    }
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }
}