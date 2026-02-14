import { IsString, IsEmail } from "class-validator";

export class LoginDto{
    @IsEmail({}, { message: 'Senha ou email inválido' })
    email: string

    @IsString({ message: 'Senha ou email inválido' })
    password: string
}