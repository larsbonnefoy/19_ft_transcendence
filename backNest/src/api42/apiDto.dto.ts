import { IsString } from "class-validator";

export class jwtDto {
    @IsString()
    token : string;
}

export class login42 {
    //@IsString()
    public login42 : string
}