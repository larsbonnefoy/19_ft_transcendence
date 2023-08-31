import { Controller, Get, Post, Param, Query, ParseIntPipe, ParseUUIDPipe, Res } from '@nestjs/common';
import exp from 'constants';
import { Response } from 'express';
// import { IsInt, IsString } from 'class-validator';
// import { identity } from 'rxjs';

import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

import { Match } from './match.entity';
import { games } from './match.gateway';
import { Game, states } from './match.entity';
import { MatchService } from './match.service';
import { newMatchDto } from './newMatchDto.dto';
// import { response } from 'express';

@Controller("match")
export class MatchController {
  constructor(private readonly userService: UserService, private readonly matchService: MatchService) {}

  @Get('history:username')
  async history(@Res() res: Response, @Param() params: any) {
	const username: string = params.username.slice(1);
    console.log("got request for Match history of player %s", username);
    const user = await this.userService.findUsername(username);
    if (user == null) {
      res.status(404).json({"error":"no player with that username"});
      return ;
    }
    const messages = await this.matchService.findAll();
	let response : Array<Match> = new Array(0);
	for (let match of messages) {
		if (match.player1 == user.login42 || match.player2 == user.login42) {
			response.push(match);
		}
	}
	if (response.length == 0)
    res.status(404).json({"No match history for player":username});
	else
		res.json(response);
  }
  
  @Get('get')
  async getMatch(@Res() res: Response) {
	console.log("Get /match");
    const messages = await this.matchService.findAll();
    res.json(messages);
  }

  @Get('add')
    async addMatch(@Res() res: Response, @Query() query: newMatchDto) {
    console.log("got from query: %s vs %s, result %d-%d", query.player1, query.player2, query.score1, query.score2);
    const nMatch: Match = new Match;
    const p1 = await this.userService.findUsername(query.player1);
    const p2 = await this.userService.findUsername(query.player2);
    if (p1 == null || p2 == null) {
      res.status(404).json({"error":"username not found in database"});
      return ;
    }
    nMatch.player1 = p1.login42;
    nMatch.player2 = p2.login42;
    nMatch.score1 = query.score1;
    nMatch.score2 = query.score2;
    let expected_result:number = 1.0 / (1 + 10 ** ((p2.elo - p1.elo) / 400));
    if (+query.score1 > +query.score2) {
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
    res.json({"Match":"created"});
  }
  
  @Get('del')
  async delMatch(@Res() res: Response, @Query('id', ParseIntPipe) id: number) {
    console.log("match/del request with id %d", id);
    const check_base = await this.matchService.findOne(id);
    if (check_base == null) {
      res.status(404).json({"Match":"doesn't exist"});
      return ;
    }
    await this.matchService.remove(id);
    res.json({"Match":"deleted"});
  }
  
  @Get('delAll')
  async delAll(@Res() res: Response) {
    const matchs = await this.matchService.findAll();
    for (let match of matchs) {
      await this.matchService.remove(match.id);
    }
    res.json({"Matchs":"deleted"});
  }

  @Get('ongoingGames')
  async getOngoingGames(@Res() res: Response) {
    let response : Array<Game> = new Array(0);
    for (let game of games) {
      if (game.state === states.ONGOING) {
        response.push(game);
      }
    }
    res.json(response);
  }
}
