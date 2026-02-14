import { IsInt, Min, IsOptional } from 'class-validator';

export class UpdateProductMaterialDto {
    @IsOptional()
    @IsInt({ message: 'Quantity must be an integer' })
    @Min(1, { message: 'Quantity must be at least 1' })
    quantity?: number;
}
