import { IsString, IsNumber, Min } from "class-validator";

export class CreateRawMaterialDto{
    @IsString({ message: 'Put a valid value'})
    name: string

    @IsString({ message: 'Put a valid value'})
    cod: string

    @IsNumber({}, { message: 'The number must be positive'})
    @Min(0, { message: 'The number must be positive'})
    stock: number
}