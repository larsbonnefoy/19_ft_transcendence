import { IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  login42: string;
}