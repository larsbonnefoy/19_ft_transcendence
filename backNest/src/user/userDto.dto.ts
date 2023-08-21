import { Transform } from 'class-transformer';
// import { IsBoolean, IsDate, IsNumber, IsNumberString, IsOptional } from 'class-validator';
// import { toBoolean, toLowerCase, toNumber, trim, toDate } from './common/helper/cast.helper';
import { IsNotEmpty, IsAlpha, IsAlphanumeric, IsStrongPassword, IsNumber, IsNumberString } from "class-validator";

export class newUserDto {
  @IsNotEmpty()
  @IsAlpha()
  public login42: string;
  
  @IsNotEmpty()
  @IsAlphanumeric()
  public username: string;
  


  //   @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  //   @IsNumber()
  //   @IsOptional()
  //   public page: number = 1;
  
  //   @Transform(({ value }) => toBoolean(value))
  //   @IsBoolean()
  //   @IsOptional()
  //   public foo: boolean = false;
  
  //   @Transform(({ value }) => trim(value))
  //   @IsOptional()
  //   public bar: string;
  
  //   @Transform(({ value }) => toLowerCase(value))
  //   @IsOptional()
//   public elon: string;

//   @IsNumberString()
//   @IsOptional()
//   public musk: string;

//   @Transform(({ value }) => toDate(value))
//   @IsDate()
//   @IsOptional()
//   public date: Date;
}

// export class changeUsernameDto {
//   @IsNotEmpty()
//   public token: string;
//   @IsNotEmpty()
//   @IsAlphanumeric()
//   public old: string;
//   @IsNotEmpty()
//   @IsAlphanumeric()
//   public new: string;
// }
