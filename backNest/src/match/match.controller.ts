import { Controller, Get, Post, Param, Query, ParseIntPipe, ParseUUIDPipe, Res } from '@nestjs/common';
import { Response } from 'express';
// import { IsInt, IsString } from 'class-validator';
// import { identity } from 'rxjs';

import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

import { Match } from './match.entity';
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
      res.status(409).json({"error":"no player with that username"});
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
    res.status(409).json({"No match history for player":username});
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
      res.status(409).json({"error":"username not found in database"});
      return ;
    }
    nMatch.player1 = p1.login42;
    nMatch.player2 = p2.login42;
    nMatch.score1 = query.score1;
    nMatch.score2 = query.score2;
    await this.matchService.createMatch(nMatch);
    res.json({"Match":"created"});
  }

  @Get('del')
  async delMatch(@Res() res: Response, @Query('id', ParseIntPipe) id: number) {
	console.log("match/del request with id %d", id);
  const check_base = await this.matchService.findOne(id);
	if (check_base == null) {
		res.status(409).json({"Match":"doesn't exist"});
		return ;
	}
    this.matchService.remove(id);
    res.json({"Match":"deleted"});
  }
}