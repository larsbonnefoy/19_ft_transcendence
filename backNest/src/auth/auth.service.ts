import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor (
        private userService: UserService,
        private jwtService: JwtService
        ) {}

    async signIn(login42: string): Promise<any> {
        const user = await this.userService.findOne(login42);
        /* if user is not in db, create his account, else return JWT
        //check if User doesnt exist
        //TODO Generate a JWT and return it here instead of user object
        */
        const payload = {sub: login42};
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
