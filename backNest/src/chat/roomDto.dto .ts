import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { IsNull } from "typeorm";

export class roomDto {

    id: number;
    
    name: string;

    isDm: boolean | null;

    isPrivate: boolean | null;

    password : string | null | undefined;

    usernames: string[] | null;

}