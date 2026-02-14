import { IsString, IsNumber, Min } from 'class-validator';

export class CreateProduct {
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsString({ message: 'Cod must be a string' })
    cod: string;

    @IsNumber({}, { message: 'Price must be a number' })
    @Min(0, { message: 'Price must be positive' })
    price: number;
}