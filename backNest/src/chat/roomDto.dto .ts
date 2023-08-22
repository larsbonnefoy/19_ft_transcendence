import { IsNotEmpty, IsString } from "class-validator";
import { IsNull } from "typeorm";

export class roomDto {
    @IsString()
    @IsNotEmpty()
    id : string;

    password : string | null | undefined;

}