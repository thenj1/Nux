import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class UpdateProductDto {
    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'Cod must be a string' })
    cod?: string;

    @IsOptional()
    @IsNumber({}, { message: 'Price must be a number' })
    @Min(0, { message: 'Price must be positive' })
    price?: number;
}