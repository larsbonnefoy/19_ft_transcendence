import { IsString } from "class-validator";

export class jwtDto {
    @IsString()
    token : string;
}