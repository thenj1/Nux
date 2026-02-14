import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ProductMaterialsRepository } from './product-materials.repository';
import { CreateProductMaterialDto } from './dto/create-product-material.dto';
import { UpdateProductMaterialDto } from './dto/update-product-material.dto';
import { PrismaService } from 'src/prisma-config/prisma.service';

@Injectable()
export class ProductMaterialsService {
    constructor(
        private productMaterialsRepository: ProductMaterialsRepository,
        private prisma: PrismaService
    ) { }

    async create(data: CreateProductMaterialDto) {
        const { productId, rawMaterialId, quantity } = data;

        const productExists = await this.prisma.product.findUnique({
            where: { id: productId }
        });
        if (!productExists) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        const rawMaterialExists = await this.prisma.rawMaterial.findUnique({
            where: { id: rawMaterialId }
        });
        if (!rawMaterialExists) {
            throw new NotFoundException(`Raw material with ID ${rawMaterialId} not found`);
        }

        const associationExists = await this.productMaterialsRepository.findByProductAndMaterial(
            productId,
            rawMaterialId
        );
        if (associationExists) {
            throw new ConflictException(
                `Product ${productId} is already associated with raw material ${rawMaterialId}`
            );
        }

        return await this.productMaterialsRepository.createProductMaterial(
            productId,
            rawMaterialId,
            quantity
        );
    }

    async findByProductId(productId: number) {
        const materials = await this.productMaterialsRepository.findByProductId(productId);

        if (materials.length === 0) {
            throw new NotFoundException(`No materials found for product ${productId}`);
        }

        return materials;
    }

    async update(id: number, data: UpdateProductMaterialDto) {
        const { quantity } = data;

        if (!quantity) {
            throw new ConflictException('Quantity is required for update');
        }

        const associationExists = await this.productMaterialsRepository.findById(id);
        if (!associationExists) {
            throw new NotFoundException(`Product-Material association with ID ${id} not found`);
        }

        return await this.productMaterialsRepository.updateProductMaterial(id, quantity);
    }

    async delete(id: number) {
        const associationExists = await this.productMaterialsRepository.findById(id);
        if (!associationExists) {
            throw new NotFoundException(`Product-Material association with ID ${id} not found`);
        }

        await this.productMaterialsRepository.deleteProductMaterial(id);
        return { message: 'Association deleted successfully' };
    }
}
