import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { authenticator } from 'otplib';
import { toDataURL} from 'qrcode';

@Injectable()
export class TwofaService {

	constructor() {}
	
	async generate2fa(user: User) : Promise<any>
	{
		console.log("AYO")
		const secret = authenticator.generateSecret();
		console.log("AYO")
		const otpUrl = authenticator.keyuri(user.login42, "ft_pong", secret);
		console.log("AYO")
		return {
			secret,
			otpUrl
		}	
	}

	async generateQR(otpUrl : string)
	{
		// console.log('generate:')
		// console.log(otpUrl);
		return toDataURL(otpUrl)
	}

	verify2fa(twofaCode : string | null, secret: string | null) : boolean
	{
		if (!twofaCode != null && secret != null)
		{ 
			return authenticator.verify(
			{
				token: twofaCode,
				secret: secret
			}
			);
		}
		else
		{
			return false;
		}
	}
}
