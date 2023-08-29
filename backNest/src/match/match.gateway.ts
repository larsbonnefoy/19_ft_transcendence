import {
  ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import {UseGuards, Request, Inject, forwardRef, Get, Res, ConsoleLogger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Response } from 'express';
import { Game, states } from './match.entity';
import { AuthGuard } from '../guard/auth.guard';
import { UserService } from '../user/user.service';
import { Match } from './match.entity';
import { MatchService } from './match.service';
import { Api42Service } from '../api42/api42.service';
import { login42 } from 'src/api42/apiDto.dto';

const canvasWidth : number = 800;
const canvasHeight : number = 600;
const ballRadius : number = 10;
const ballSpeed : number = 10; //speed should be at least > 2

export let games : Array<Game> = new Array(0);

@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
//      allowedHeaders: ["my-custom-header"],
//      credentials: true
  },
})
export class MatchGateway {
  constructor(@Inject(forwardRef(() => Api42Service)) private  api42Service: Api42Service, private readonly userService: UserService, private readonly matchService: MatchService) {}

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
  async computeLeftPaddle(@MessageBody() data: {dir: number, roomIndex: number}) {
	if (+data.roomIndex < 0 || +data.roomIndex >= games.length)
		return ;
	games[data.roomIndex].updateLeftPaddle(data.dir);
  }

  @SubscribeMessage('rightPaddle')
  async computeRightPaddle(@MessageBody() data: {dir: number, roomIndex: number}) {
	if (+data.roomIndex < 0 || +data.roomIndex >= games.length)
		return ;
    games[data.roomIndex].updateRightPaddle(data.dir);
  }

  @SubscribeMessage('updatePaddle')
  async computePaddle(@MessageBody() data: {dir: number, roomIndex: number, token: string}) {
	if (+data.roomIndex < 0 || +data.roomIndex >= games.length)
		return ;
    let login42: string = "";
    try {
      login42 = this.api42Service.decodeJWT(data.token);
    }
    catch (error) {
      return ;
    }
	const game: Game = games[data.roomIndex];
    if (game.player0 === login42)
      game.updateLeftPaddle(data.dir);
    else if (game.player1 === login42)
      game.updateRightPaddle(data.dir);
  }

  @SubscribeMessage('display')
  async display(@MessageBody() roomIndex: number) {
	if (+roomIndex < 0 || +roomIndex >= games.length)
		return ;
    // console.log("display update from room " + roomIndex);
	const game: Game = games[roomIndex];
    let save_state : states = game.state;
    game.updateGameArea(new Date().getTime());
    if (game.state === states.ENDED) {
      this.server.to(game.roomName).emit("endGame", roomIndex);
      if (save_state === states.ONGOING) {
        console.log("updated games history");
        const nMatch: Match = new Match;
        console.log("player0" + game.player0);
        console.log("player1" + game.player1);
        const p1 = await this.userService.findOne(game.player0);
        const p2 = await this.userService.findOne(game.player1);
        if (p1 == null || p2 == null) {
          console.log("return on player null in display in match.gateway");
		  game.resetGame();
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
        game.resetGame();
      }
    }
    else
      this.server.to(game.roomName).emit("display", game);
  }

  // @SubscribeMessage('startGame')
  // async computeGame() {
  //     if (!game.ongoing) {
  //         game.ongoing = true;
  //         setInterval(updateGameArea, 20);
  //     }
  // }
  //@UseGuards(AuthGuard)
  @SubscribeMessage('joinGame')
  async joinGame(@ConnectedSocket() client: any, @MessageBody() token: string) {
    let login42: string = "";
    try {
      login42 = this.api42Service.decodeJWT(token);
    }
    catch (error) {
      return ;
    }
    // console.log("token in join game" + login42);
    // console.log(client.id);
    let roomIndex: number = 0;
    let roomName: string = "";
    for (let game of games) { // checking if player already in a game (he left previously)
      roomName = "room" + roomIndex;
      console.log("checking " + roomName);
      if (game.state !== states.ENDED && (game.player0 === login42 || game.player1 === login42)) {
        // console.log(new Date().getTime() - game.lastTimeStamp);
        if (game.state === states.ONGOING && new Date().getTime() - game.lastTimeStamp > 10000) {
          console.log("Game stop because timer");
          game.resetGame();
          break ;
        }
        client.join(roomName);
        if (game.state === states.ONGOING)
          this.server.to(roomName).emit("joinGame", roomIndex);
        else // not happening anymore
          this.server.to(roomName).emit("display", game);
        console.log(login42 + ": rejoins " + roomName)
        return ;
      }
      ++roomIndex;
    }
    roomIndex = 0;
    for (let game of games) {
      roomName = "room" + roomIndex;
      console.log("checking " + roomName);
      if (game.state === states.STARTING) {
        if (game.player0 === "") {
          game.player0 = login42;
          client.join(roomName);
          this.server.to(game.roomName).emit("display", game);
          console.log(login42 + ": joins " + roomName);
          return ;
        } else if (game.player1 === "") {
          game.state = states.ONGOING;
          game.player1 = login42;
          game.lastTimeStamp = new Date().getTime();
          client.join(roomName);
          this.server.to(roomName).emit("joinGame", roomIndex);
          console.log(login42 + ": second joins " + roomName);
          return ;
        }
      }
      ++roomIndex;
    }
    roomName = "room" + roomIndex;
    games.push(new Game())
    games[roomIndex].player0 = login42;
    games[roomIndex].roomName = roomName;
    client.join(roomName);
    this.server.to(roomName).emit("display", games[roomIndex]);
    console.log("new game in " + roomName);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(@ConnectedSocket() client: any, @MessageBody() data: {roomIndex: number, token: string}) {
    let login42: string = "";
    try {
      login42 = this.api42Service.decodeJWT(data.token);
    }
    catch (error) {
      return ;
    }
	if (data.roomIndex === -1) { // if user leaves before game starts, we abort matchmaking
		for (let game of games) {
			if (game.state === states.STARTING && game.player0 === login42) {
				game.resetGame();
				console.log(login42 + " leaves " + game.roomName);
				client.leave(game.roomName);
				return ;
			}
		}
	} else if (data.roomIndex >= 0 && data.roomIndex < games.length) {
		client.leave(games[data.roomIndex].roomName);  // client leaves room, but joins it again when he rejoins the game
	}
  }

  @SubscribeMessage('leaveRoomSearch')
  async leaveRoomSearch(@ConnectedSocket() client: any, @MessageBody() token: string) {
    let login42: string = "";
    try {
      login42 = this.api42Service.decodeJWT(token);
    }
    catch (error) {
      return ;
    }
    for (let game of games) {
      if (game.player0 === login42 || game.player1 === login42) {
        if (game.state === states.STARTING) {
          game.resetGame();
        }
        console.log(login42 + " leaves " + game.roomName);
        client.leave(game.roomName); // client leaves room, but joins it again when he rejoins the game
        return ;
      }
    }
	// if (data.roomIndex === -1) { // if user leaves before game starts, we abort matchmaking
	// 	for (let game of games) {
	// 		if (game.state === states.STARTING && game.player0 === login42) {
	// 			game.resetGame();
	// 			console.log(login42 + " leaves " + game.roomName);
	// 			client.leave(game.roomName);
	// 			return ;
	// 		}
	// 	}
	// } else if (data.roomIndex >= 0 && data.roomIndex < games.length) {
	// 	client.leave(games[data.roomIndex].roomName);  // client leaves room, but joins it again when he rejoins the game
	// }
  }

  @SubscribeMessage('watchGame')
  async watchParty(@ConnectedSocket() client: any, @MessageBody() data: {roomName: string, token: string}) {
    let login42: string = "";
    try {
      login42 = this.api42Service.decodeJWT(data.token);
    }
    catch (error) {
      return ;
    }
    let roomIndex: number = 0;
    for (let game of games) {
      if (game.roomName == data.roomName && game.state === states.ONGOING) {
        if (game.player0 === login42 || game.player1 === login42) {
          this.joinGame(client, data.token);
          // this.server.to(login42).emit('setAsPlayer');
          return ;
        }
        if (game.state === states.ONGOING && new Date().getTime() - game.lastTimeStamp > 10000) {
          console.log("Game stop because timer");
          game.resetGame();
          client.join(data.roomName);
          this.server.to(data.roomName).emit("endGame", roomIndex);
          return ;
        }
        client.join(data.roomName);
        console.log(client.id + " joined room " + data.roomName);
        return ;
	    }
      ++roomIndex;
    }
  }

  @SubscribeMessage('isInGame')
  async isInGame(@MessageBody() data: {origin: string, token: string}) : Promise<boolean> {
    let login42: string = "";
    try {
      login42 = this.api42Service.decodeJWT(data.token);
    }
    catch (error) {
      return ;
    }
    console.log("request check isInGame " + login42);
    for (let game of games) {
      if (game.player0 === login42 || game.player1 === login42)
        return ;
    }
    this.server.to(login42).emit("notification", data.origin);
  }

  @SubscribeMessage('sendNotification')
  async sendNotification(@MessageBody() data: {target: string, token: string}) {
    let login42: string = "";
    try {
      login42 = this.api42Service.decodeJWT(data.token);
    }
    catch (error) {
      return ;
    }
    for (let game of games) {
      if (game.player0 === login42 || game.player1 === login42) {
        console.log("already in game, so can't send notification");
        return ;
      }
    }
    console.log(login42 + " sending notif to " + data.target);
	  this.server.to(data.target).emit("challenge", login42);
  }

  @SubscribeMessage('acceptChallenge')
  async acceptChallenge(@MessageBody() data: {target: string, token: string}) {
	  let login42: string = "";
    try {
      login42 = this.api42Service.decodeJWT(data.token);
    }
    catch (error) {
      return ;
    }
    for (let game of games) {
      if (game.player0 === data.target || game.player1 === data.target)
        return ;
    }
    let mustAppend: boolean = true;
    let roomIndex: number = 0;
    for (let game of games) {
      if (game.state === states.STARTING && game.player0 === "") {
        game.state = states.ONGOING;
        game.player0 = data.target;
        game.player1 = login42;
        game.lastTimeStamp = new Date().getTime();
        mustAppend = false;
        console.log("challenge between " + data.target + " and " + login42 + " in " + game.roomName);
        break ;
      }
      ++roomIndex;
    }
    if (mustAppend) {
      const roomName: string = "room" + roomIndex;
      games.push(new Game());
      games[roomIndex].roomName = roomName;
      games[roomIndex].state = states.ONGOING;
      games[roomIndex].player0 = data.target;
      games[roomIndex].player1 = login42;
      games[roomIndex].lastTimeStamp = new Date().getTime();
      console.log("new room for challenge between " + data.target + " and " + login42 + " in " + games[roomIndex].roomName);
    }
	  this.server.to(data.target).emit("challengeAccepted", login42);
  }

  // to allow notifications, we put users in individual rooms that others can join shortly to send them notifications
  @SubscribeMessage('joinMyRoom')
  async joinMyRoom(@ConnectedSocket() client: any, @MessageBody() token: string) {
	let login42: string = "";
    try {
      login42 = this.api42Service.decodeJWT(token);
    }
    catch (error) {
      return ;
    }
	client.join(login42);
  // console.log(client.rooms);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }
  
  handleDisconnect(client: Socket) {
    //disconnect user here
    console.log(`Client disconnected: ${client.id}`);
  }
}