import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './loginBodyDto.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        console.log(signInDto.login42)
        return this.authService.signIn(signInDto.login42);
    }
}