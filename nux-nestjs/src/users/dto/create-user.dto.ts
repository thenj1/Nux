import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: 'Invalid Email'})
    email: string;

    @IsString({ message: 'Invalid name' })
    name: string;

    @MinLength(8, { message: 'Password must have more than 8 character'})
    password: string;
}