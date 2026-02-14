import { IsString, IsEmail, MinLength, IsOptional} from "class-validator";

export class UpdateUserDto{
    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
    password: string
}