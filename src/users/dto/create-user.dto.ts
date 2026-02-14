import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: 'Email inválido'})
    email: string;

    @IsString({ message: 'Nome inválido' })
    name: string;

    @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres'})
    password: string;
}