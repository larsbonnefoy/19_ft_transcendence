import { Controller, Get, Post, Param, Query, ParseIntPipe, ParseUUIDPipe, Res } from '@nestjs/common';
// import { IsInt, IsString } from 'class-validator';
// import { identity } from 'rxjs';

// import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

import { Match } from './match.entity';
import { MatchService } from './match.service';
import { newMatchDto } from './newMatchDto.dto';
// import { response } from 'express';

@Controller("match")
export class MatchController {
  constructor(private readonly userService: UserService, private readonly matchService: MatchService) {}
  
  @Get('history:name')
  async history(@Res() res: any, @Param() params: any) {
	const name: string = params.name.slice(1)
    console.log("got request for Match history of player %s", name);
    const messages = await this.matchService.findAll();
	let response : Array<Match> = new Array(0);
	for (let match of messages) {
		if (match.player1 == name || match.player2 == name) {
			response.push(match);
		}
	}
	if (response.length == 0)
		res.json({"No match history for player":name});
	else
		res.json(response);
  }
  
  @Get('get')
  async getMatch(@Res() res: any) {
	console.log("Get /match");
    const messages = await this.matchService.findAll();
    res.json(messages);
  }

  @Get('add')
  async addMatch(@Res() res: any, @Query() query: newMatchDto) {
	console.log("got from query: %s vs %s, result %d-%d", query.player1, query.player2, query.score1, query.score2);
    const nMatch: Match = new Match;
    nMatch.player1 = query.player1;
    nMatch.player2 = query.player2;
    nMatch.score1 = query.score1;
    nMatch.score2 = query.score2;
    await this.matchService.createMatch(nMatch);
    res.json({"Match":"created"});
  }

  @Get('del')
  async delMatch(@Res() res: any, @Query('id', ParseIntPipe) id: number) {
	console.log("match/del request with id %d", id);
    this.matchService.remove(id);
    res.json({"Match":"deleted"});
  }
}
