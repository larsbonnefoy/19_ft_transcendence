import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TwofaService } from './twofa.service';
import { jwtDto } from '../api42/jwtDto.dto';
import { UserService } from '../user/user.service';
import { Api42Service } from '../api42/api42.service';

@Controller('twofa')
export class TwofaController {
  constructor(
	private readonly twofaService: TwofaService,
	private userService : UserService, 
	private api42Service: Api42Service) {}

	@Post('enable')
	async enable2fa(@Body() jwtDto: jwtDto)
	{
		try
		{
			console.log(jwtDto.token);
			const login42 = this.api42Service.decodeJWT(jwtDto.token);
			const twofaJSON = await this.twofaService.generate2fa(await this.userService.findOne(login42));
			console.log(twofaJSON);
			console.log('yo')
			const qrUrl = await this.twofaService.generateQR(twofaJSON['otpUrl'])
			console.log('hmmm : '+ qrUrl);
			this.userService.enable2fa(login42, twofaJSON['secret']);
			return (qrUrl);
		}
		catch (error)
		{
			console.log("error")
			return error;
		}
	}
	@Get('enable')
	async enable2faGET(@Query() jwtDto : jwtDto)
	{
		try
		{
			console.log('token :' + jwtDto.token);
			const login42 = this.api42Service.decodeJWT(jwtDto.token);
			const twofaJSON = await this.twofaService.generate2fa(await this.userService.findOne(login42));
			console.log(twofaJSON);
			console.log('yo')
			const qrUrl = await this.twofaService.generateQR(twofaJSON['otpUrl'])
			console.log('hmmm : '+ qrUrl);
			this.userService.enable2fa(login42, twofaJSON['secret']);
			// let response : Response;
			// response.headers.set("Content-Type", "data:image/png;base64")
			return (qrUrl);
		}
		catch (error)
		{
			console.log("error")
			return error;
		}
	}

	@Post('login')
	async login(@Body() body:string)
	{
			const login42 = this.api42Service.decodeJWT(body['jwt_token']);
			return (this.twofaService.verify2fa(body['code'], (await this.userService.findOne(login42)).twofaSecret));
	}
}

