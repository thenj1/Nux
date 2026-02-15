import { IsInt, Min } from 'class-validator';

export class CreateProductMaterialDto {
    @IsInt({ message: 'Product ID must be an integer' })
    productId: number;

    @IsInt({ message: 'Raw Material ID must be an integer' })
    rawMaterialId: number;

    @IsInt({ message: 'Quantity must be an integer' })
    @Min(1, { message: 'Quantity must be at least 1' })
    quantity: number;
}
