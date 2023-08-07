// import { Transform } from 'class-transformer';
// import { IsBoolean, IsDate, IsNumber, IsNumberString, IsOptional } from 'class-validator';
// import { toBoolean, toLowerCase, toNumber, trim, toDate } from './common/helper/cast.helper';
import { IsNotEmpty, IsAlpha, IsStrongPassword } from "class-validator";

export class newUserDto {
  @IsNotEmpty()
  @IsAlpha()
  public name: string;
  
  @IsNotEmpty()
  @IsAlpha()
  public username: string;
  
  @IsNotEmpty()
  @IsStrongPassword()
  public password: string;
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

export class connectUserDto {
	@IsNotEmpty()
	@IsAlpha()
	public username: string;
	
	@IsNotEmpty()
	public password: string;
}
