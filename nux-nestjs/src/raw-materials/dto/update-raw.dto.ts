import { IsString, IsNumber, Min, IsOptional } from "class-validator";

export class UpdateRawMaterialDto{
    @IsOptional()
    @IsString({ message: 'Put a valid value'})
    name?: string

    @IsOptional()
    @IsString({ message: 'Put a valid value'})
    cod?: string

    @IsOptional()
    @IsNumber({}, { message: 'The number must be positive'})
    @Min(0, { message: 'The number must be positive'})
    stock?: number
}