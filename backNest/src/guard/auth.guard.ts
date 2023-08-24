import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Api42Service } from '../api42/api42.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, api42Service: Api42Service) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try 
    {
        console.log("GUARD");
        console.log(process.env.JWT_SECRET);
        const decoded = await this.jwtService.verifyAsync
        (
          token,
          {
          secret: process.env.JWT_SECRET
          }
        );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      if (!decoded['auth'])
          return false;
      if (!decoded['sub'])
         return false;
      request['user'] = decoded['sub'];
    }
    catch {
      console.log("catch");
      throw new UnauthorizedException();
    }
    return true;
  }


  private extractTokenFromHeader(request: Request): string | null {
    const token : any  = request.headers['token'];
    console.log("extract:  ")
    console.log(token);
    if (token === null || token === undefined)
      return null;
    return token;
  }
}
