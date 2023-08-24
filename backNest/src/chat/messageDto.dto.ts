import { IsNotEmpty, IsString } from "class-validator";

export class messageDto {
    @IsString()
    @IsNotEmpty()
    roomId : string;

    @IsString()
    @IsNotEmpty()
    userId : string;

    @IsString()
    message : string
}