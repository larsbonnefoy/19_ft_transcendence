import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { IsNull } from "typeorm";

export class roomDto {
    @IsString()
    @IsNotEmpty()
    id : string;

    @IsBoolean()
    isPrivate: boolean;

    password : string | null | undefined;

}