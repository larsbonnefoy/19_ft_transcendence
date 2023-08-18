import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { TwofaService } from './twofa.service';
import { jwtDto } from '../api42/apiDto.dto';
import { UserService } from '../user/user.service';
import { Api42Service } from '../api42/api42.service';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Controller('twofa')
export class TwofaController {
  constructor(
	private readonly twofaService: TwofaService,
	private userService : UserService, 
	private api42Service: Api42Service) {}

	@Post('create')
	async create2fa(@Body() jwtDto: jwtDto)
	{
		try
		{
			console.log(jwtDto.token);
			const login42 = this.api42Service.decodeJWT(jwtDto.token);
			const twofaJSON = await this.twofaService.generate2fa(await this.userService.findOne(login42));
			
			const iv = randomBytes(16);
			const key = (await promisify(scrypt)(process.env.ENC_KEY, process.env.ENC_SALT, 32)) as Buffer;
			const cipher = createCipheriv(process.env.ENC_ALG, key, iv);
			console.log('lesgo ?');
			const secret = Buffer.concat([iv, cipher.update(twofaJSON['secret']), cipher.final()]);
			console.log(secret);
			console.log("twofa : " + twofaJSON['secret']);
			


			await this.userService.update2faSecret(login42, secret); //TODO CYPHER SECRET
			console.log(twofaJSON);
			const qrUrl = await this.twofaService.generateQR(twofaJSON['otpUrl'])
			// console.log('hmmm : '+ qrUrl);
			// this.userService.enable2fa(login42, twofaJSON['secret']); //TODO CYPHER SECRET
			return (qrUrl);
		}
		catch (error)
		{
			console.log(error);
			try
			{
				const login42 = this.api42Service.decodeJWT(jwtDto.token);
				this.userService.disable2fa(login42);
			}
			catch {}
			return error;
		}
	}
	@Post('enable')
	async enable2fa(@Body() jwtDto: jwtDto)
	{
		try
		{
			const login42 = this.api42Service.decodeJWT(jwtDto.token);
			const twofaJSON = await this.twofaService.generate2fa(await this.userService.findOne(login42));
			console.log(twofaJSON);
			await this.userService.enable2fa(login42); //TODO CYPHER SECRET
			console.log("user : ");
			console.log(this.userService.findOne(login42));
		}
		catch (error)
		{
			return error;
		}

	}

	@Post('verify')
	async verify(@Body() body:string)
	{

			const login42 = this.api42Service.decodeJWT(body['token']);
		

			const secret = (await this.userService.findOne(login42)).twofaSecret
			
			console.log('secret encrypted :' + secret);

			const iv = secret.slice(0,16);
			const key = (await promisify(scrypt)(process.env.ENC_KEY, process.env.ENC_SALT, 32)) as Buffer;
			const decipher = createDecipheriv('aes-256-ctr', key, iv);
			const decrypted = Buffer.concat([
			  decipher.update(secret.slice(16)),
			  decipher.final(),
			]);

			console.log('code :' + body['code'])
			// console.log(await this.userService.findOne(login42))
			console.log("twofaSecret decrypted : " + decrypted.toString());
			console.log(this.twofaService.verify2fa(body['code'], decrypted.toString()));
			return (this.twofaService.verify2fa(body['code'], decrypted.toString()));
	}

	@Post('disable')
	async disable2fa(@Body() jwtDto: jwtDto)
	{
		try
		{
			const login42 = this.api42Service.decodeJWT(jwtDto.token);
			await this.userService.disable2fa(login42);
			return 'ok';
		}
		catch (error)
		{
			return error;
		}
	}

	@Post('status')
	async status(@Body() jwtDto: jwtDto)
	{
		try
		{
			const login42 = this.api42Service.decodeJWT(jwtDto.token);
			console.log("status : ");
			console.log((await this.userService.findOne(login42)).has2fa);
			return ((await this.userService.findOne(login42)).has2fa);
		}
		catch (error)
		{
			return (error);
		}
	}

	//GET IS METHOD ARE ONLY USE IN TESTING 
	@Get('enable')//to remove
	async enable2faGET(@Query() jwtDto : jwtDto, @Res({passthrough: true}) response)
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
			this.userService.enable2fa(login42);
			const htmlStr : string = "<!DOCTYPE html>\n<html>\n<head>\n<title>Base64 QR</title>\n</head>\n<body>\n<h1>Base64 QR</h1>\n<img alt=\"qr\" src=" + qrUrl + ">\n</body>\n</html>"
			await response.status(200).send(htmlStr);
			// return (qrUrl);
			return ;
		}
		catch (error)
		{
			console.log("error")
			return error;
		}
	}
	@Get('disable')
	async disable2faGET(@Query() jwtDto: jwtDto)
	{
		try
		{

			const login42 = this.api42Service.decodeJWT(jwtDto.token);
			await this.userService.disable2fa(login42);
			return ;
		}
		catch (error)
		{
			return error;
		}
	}
}

