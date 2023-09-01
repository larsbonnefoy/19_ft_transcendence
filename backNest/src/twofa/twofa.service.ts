import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { authenticator } from 'otplib';
import { toDataURL} from 'qrcode';

@Injectable()
export class TwofaService {

	constructor() {}
	
	async generate2fa(user: User) : Promise<any>
	{
		const secret = authenticator.generateSecret();
		const otpUrl = authenticator.keyuri(user.login42, "ft_pong", secret);
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
