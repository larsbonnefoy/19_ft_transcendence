import {
  ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Inject, forwardRef } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Game, game_mode, states } from './match.entity';
import { UserService } from '../user/user.service';
import { Match } from './match.entity';
import { MatchService } from './match.service';
import { Api42Service } from '../api42/api42.service';

export let games : Array<Game> = new Array(0);

@WebSocketGateway({
  cors: {
    origin: ["http://http://10.2.7.2:5173", "http://localhost:5173"],
    methods: ["GET", "POST"],
//      allowedHeaders: ["my-custom-header"],
//      credentials: true
  },
})
export class MatchGateway {
  constructor(@Inject(forwardRef(() => Api42Service)) private  api42Service: Api42Service, private readonly userService: UserService, private readonly matchService: MatchService) {}

  @WebSocketServer()
  server: Server;
  
  @SubscribeMessage('win')
  async winGame(@MessageBody() data: {roomIndex: number, token: string}) {
    let login42: string = "";
    try {
      login42 = this.api42Service.decodeJWT(data.token);
    }
    catch (error) {
      return ;
    }
	if (+data.roomIndex < 0 || +data.roomIndex >= games.length) {
		return ;
	}
	const user = await this.userService.findOne(login42);
	if (user === null) {
	  return ;
	} /* else if (+user.achievements & 16) {
	  console.log(login42 + " is already a retro gamer");
	  this.server.to(login42).emit('warning', "You are already a Retro gamer");
	  return ;
	} */
    let game: Game = games[data.roomIndex];
    if (game.player0 === login42)
      game.score0 = 9;
    else if (game.player1 === login42)
      game.score1 = 9;
    if (!(+user.achievements & 16)) {
      this.userService.addAchievement(login42, +user.achievements + 16, 16);
    }
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

  @SubscribeMessage('updateBothPaddles')
  async computeBothPaddles(@MessageBody() data: {dir: number, roomIndex: number, token: string}) {
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
    game.updateLeftPaddle(data.dir);
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
        let games_played : number = +p1.win + (+p1.loss) + 1;
        let message : string = "";
        switch (games_played) {
          case (1):
            message = "Getting Started";
            break ;
          case (19):
            message = "Lifeguard";
            break ;
          case (42):
            message = "Welcome to the Jar";
            break ;
        }
        if (message !== "") {
          this.server.to(p1.login42).emit('achievement', message);
          this.server.to(p1.login42).emit('achievementUpdate');
        }
        games_played = +p2.win + (+p2.loss) + 1;
        message = "";
        switch (games_played) {
          case (1):
            message = "Getting Started";
            break ;
          case (19):
            message = "Lifeguard";
            break ;
          case (42):
            message = "Welcome to the Jar";
            break ;
        }
        if (message !== "") {
          this.server.to(p2.login42).emit('achievement', message);
          this.server.to(p2.login42).emit('achievementUpdate');
        }
        nMatch.gMode = game.gMode;
        nMatch.player1 = p1.login42;
        nMatch.player2 = p2.login42;
        nMatch.score1 = game.score0;
        nMatch.score2 = game.score1;
        let expected_result:number = 1.0 / (1 + 10 ** ((p2.elo - p1.elo) / 400));
        if (+game.score0 > +game.score1) {
          await this.userService.addWin(p1.login42, +p1.win + 1);
          await this.userService.addLoss(p2.login42, +p2.loss + 1);
          let newelo1: number = +p1.elo + (1 - expected_result) * (16 + 8 * (+game.gMode));
          await this.userService.change_elo(p1.login42, newelo1);
          let newelo2: number = +p2.elo - (1 - expected_result) * (16 + 8 * (+game.gMode));
          await this.userService.change_elo(p2.login42, newelo2);
          nMatch.elo1 = Math.ceil(newelo1);
          nMatch.elo2 = Math.ceil(newelo2);
          console.log("player1 wins");
          console.log("formula gives %f, p1 gains %d", expected_result, (1 - expected_result) * (16 + 8 * (+game.gMode)));
          if (+game.score1 === 0 && !(p1.achievements & 4)) { //flawless victory for the first time
            await this.userService.addAchievement(p1.login42, +p1.achievements + 4, 4);
          }
          if (game.move0 === false && !(p1.achievements & 128)) { //telekinesis
            await this.userService.addAchievement(p1.login42, +p1.achievements + 128, 128);
          }
        }
        else {
          await this.userService.addWin(p2.login42, +p2.win + 1);
          await this.userService.addLoss(p1.login42, +p1.loss + 1);
          let newelo1: number = +p1.elo - expected_result * (16 + 8 * (+game.gMode));
          await this.userService.change_elo(p1.login42, +p1.elo - expected_result * (16 + 8 * (+game.gMode)));
          let newelo2: number = +p2.elo + expected_result * (16 + 8 * (+game.gMode));
          await this.userService.change_elo(p2.login42, +p2.elo + expected_result * (16 + 8 * (+game.gMode)));
          nMatch.elo1 = Math.ceil(newelo1);
          nMatch.elo2 = Math.ceil(newelo2);
          console.log("player2 wins");
          console.log("formula gives %f, p1 loses %f", 1 - expected_result, expected_result * (16 + 8 * (+game.gMode)));
          if (+game.score0 === 0 && !(p2.achievements & 4)) {
            await this.userService.addAchievement(p2.login42, +p2.achievements + 4, 4);
          }
          if (game.move1 === false && !(p2.achievements & 128)) { //telekinesis
            await this.userService.addAchievement(p2.login42, +p2.achievements + 128, 128);
          }
        }
        if (+game.score0 >= 20 && !(p1.achievements & 512)) { //Double The Trouble
          await this.userService.addAchievement(p1.login42, +p1.achievements + 512, 512);
          if (+game.score1 > +game.score0 && !(p1.achievements & 1024)) { //All for nothing
            await this.userService.addAchievement(p1.login42, +p1.achievements + 1024, 1024);
          }
        }
        if (+game.score1 >= 20 && !(p2.achievements & 512)) { //Double The Trouble
          await this.userService.addAchievement(p2.login42, +p2.achievements + 512, 512);
          if (+game.score0 > +game.score1 && !(p2.achievements & 1024)) { //All for nothing
            await this.userService.addAchievement(p2.login42, +p2.achievements + 1024, 1024);
          }
        }
        await this.matchService.createMatch(nMatch);
        game.resetGame();
      }
    }
    else
      this.server.to(game.roomName).emit("display", game);
  }

  @SubscribeMessage('joinGame')
  async joinGame(@ConnectedSocket() client: any, @MessageBody() data: {mode: number, token: string}) {
    let login42: string = "";
    try {
      login42 = this.api42Service.decodeJWT(data.token);
    }
    catch (error) {
      return ;
    }
    if (data.mode === null || (+data.mode !== game_mode.DEFAULT && +data.mode !== game_mode.OBSTACLES && +data.mode !== game_mode.RANDOM))
      data.mode = game_mode.BOTH;
    // console.log("game mode is " + data.mode);
    let roomIndex: number = 0;
    let roomName: string = "";
    for (let game of games) { // checking if player already in a game (he left previously)
      roomName = "room" + roomIndex;
      console.log("checking rejoin " + roomName);
      if (game.state !== states.ENDED && (game.player0 === login42 || game.player1 === login42)) {
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
    for (let game of games) { // loop through all rooms to see if someone waiting
      roomName = "room" + roomIndex;
      console.log("checking second join " + roomName);
      if (game.state === states.STARTING) {
        if (game.player0 !== "" && game.player1 === ""
          && (+game.gMode === +data.mode || +game.gMode === game_mode.BOTH || +data.mode === game_mode.BOTH)) {
          game.state = states.ONGOING;
          if (+game.gMode === game_mode.BOTH) {
            if (+data.mode === game_mode.BOTH)
              game.gMode = game_mode.OBSTACLES;
            else
              game.gMode = data.mode;
          }
          game.player1 = login42;
          game.launchGame();
          client.join(roomName);
          this.server.to(roomName).emit("joinGame", roomIndex);
          console.log(login42 + ": second joins " + roomName);
          return ;
        }
      }
      ++roomIndex;
    }
    roomIndex = 0;
    for (let game of games) { // loop through all rooms to find empty room
      roomName = "room" + roomIndex;
      console.log("checking join " + roomName);
      if (game.state === states.STARTING) {
        if (game.player0 === "") {
          game.player0 = login42;
          game.gMode = data.mode;
          client.join(roomName);
          this.server.to(game.roomName).emit("display", game);
          console.log(login42 + ": joins " + roomName);
          return ;
        }
      }
      ++roomIndex;
    }
    roomName = "room" + roomIndex;
    games.push(new Game())
    games[roomIndex].player0 = login42;
    games[roomIndex].gMode = data.mode;
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
				  console.log("(index -1) " + login42 + " leaves " + game.roomName);
				  client.leave(game.roomName);
				  return ;
			  }
		  }
	  } else if (data.roomIndex >= 0 && data.roomIndex < games.length) {
      let game: Game = games[data.roomIndex];
      console.log(login42 + " leaves " + game.roomName);
      if (game.state === states.STARTING) {
        game.resetGame();
      }
		  client.leave(game.roomName);  // client leaves room, but joins it again when he rejoins the game
	  }
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
        if (game.player0 === login42 || game.player1 === login42) { //not happening anymore
          this.joinGame(client, {mode: game_mode.BOTH, token: data.token});
          return ;
        }
        const diff: number = new Date().getTime() - game.lastTimeStamp;
        if (diff > 10000) {
          console.log("Game stop because timer");
          game.resetGame();
          client.join(data.roomName);
          this.server.to(data.roomName).emit("endGame", roomIndex);
          return ;
        } else if (diff > 1000) {
          this.server.to(login42).emit("endGame", roomIndex);
          return ;
        }
        client.join(data.roomName);
        this.server.to(login42).emit("joinGame", roomIndex);
        console.log(client.id + " joined room " + data.roomName);
        return ;
	  } else if (game.roomName == data.roomName) { //game ended
        this.server.to(login42).emit("endGame", roomIndex);
        return ;
      }
      ++roomIndex;
    }
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
      if (game.player0 === login42 || game.player1 === login42 || game.player0 === data.target || game.player1 === data.target) {
        console.log("already in game, so can't send notification");
        return ;
      }
    }
    const user = await this.userService.findOne(login42);
    if (user == null) {
      console.log("can't find user with login " + login42);
      return ;
    }
    console.log(login42 + " sending notif to " + data.target);
	this.server.to(data.target).emit("gameNotification", {login42:login42, username:user.username});
  }

  @SubscribeMessage('acceptChallenge')
  async acceptChallenge(@MessageBody() data: {target: string, token: string}) {
	  let login42: string = "";
    try {
      login42 = this.api42Service.decodeJWT(data.token);
    }
    catch (error) {
	  console.log("ERROR LOGIN acceptChallenge");
      return ;
    }
	// console.log(login42 + " acceptChallenge " + data.target);
    for (let game of games) {
      if (game.player0 === data.target || game.player1 === data.target || game.player0 === login42 || game.player1 === login42) {
		  console.log("already in game, so can't accept challenge");
		  return ;
	  }
    }
    let mustAppend: boolean = true;
    let roomIndex: number = 0;
    for (let game of games) {
      if (game.state === states.STARTING && game.player0 === "") {
        game.state = states.ONGOING;
        game.player0 = data.target;
        game.player1 = login42;
        game.gMode = game_mode.OBSTACLES;
        game.lastTimeStamp = new Date().getTime();
		games[roomIndex].timeOut = 6000; // to wait for router.push
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
      games[roomIndex].gMode = game_mode.OBSTACLES;
      games[roomIndex].lastTimeStamp = new Date().getTime();
      games[roomIndex].timeOut = 6000; // to wait for router.push
      console.log("new room for challenge between " + data.target + " and " + login42 + " in " + games[roomIndex].roomName);
    }
	this.server.to(login42).emit("challengeAccepted");
	this.server.to(data.target).emit("challengeAccepted");
	this.server.to(login42).emit("challengeAcceptedJoinGame");
	this.server.to(data.target).emit("challengeAcceptedJoinGame");
  }

  // to allow notifications, we put users in individual rooms that others can trigger to send them notifications
  @SubscribeMessage('joinMyRoom')
  async joinMyRoom(@ConnectedSocket() client: Socket, @MessageBody() token: string) {
	  let login42: string = "";
    try {
      login42 = this.api42Service.decodeJWT(token);
    }
    catch (error) {
      return ;
    }
    const current_id = await this.userService.getClientId(login42);
    if (current_id !== client.id) {
      await this.userService.setClientId(login42, client.id);
      if (current_id !== "") {
        this.server.to(login42).emit('doubleConnection');
      }
      client.join(login42);
	//   console.log(login42 + " in his room");
	//   console.log(client.rooms);
	  await this.userService.set_status(login42, "online");
    }
  }

  @SubscribeMessage('gold')
  async gold(@MessageBody() token: string) {
	let login42: string = "";
    try {
      login42 = this.api42Service.decodeJWT(token);
    }
    catch (error) {
      return ;
    }
	const user = await this.userService.findOne(login42);
    if (user == null) {
      console.log("can't find user with login " + login42);
      return ;
    }
	if (!(user.achievements & 64))
		await this.userService.addAchievement(login42, +user.achievements + 64, 64);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }
  
  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const users = await this.userService.findAll();
    for (let user of users) {
      if (user.client_id === client.id) {
        await this.userService.set_status(user.login42, "offline");
        await this.userService.setClientId(user.login42, "");
        return ;
      }
    }
  }
}