import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { IsNull } from "typeorm";

export class roomDto {
    @IsString()
    @IsNotEmpty()
    id : string;

    // @IsBoolean() 
    isPrivate: boolean | null;

    password : string | null | undefined;

}