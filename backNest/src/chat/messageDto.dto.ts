import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class messageDto {
    @IsNumber()
    @IsNotEmpty()
    roomId : number;

    @IsString()
    message : string
}