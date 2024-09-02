import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";
import { LoginAuthDto } from "./login-auth.dto";

export class RegisterAuthDto extends (LoginAuthDto) {

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    username: string;
}
