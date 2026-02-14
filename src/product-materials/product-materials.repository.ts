import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma-config/prisma.service";
import { Prisma, ProductMaterial } from "@prisma/client";

@Injectable()
export class ProductMaterialsRepository {
    constructor(private prisma: PrismaService) { }

    async createProductMaterial(productId: number, rawMaterialId: number, quantity: number): Promise<ProductMaterial> {
        return await this.prisma.productMaterial.create({
            data: {
                productId,
                rawMaterialId,
                quantity
            },
            include: {
                rawMaterial: true,
                product: true
            }
        })
    }

    async findByProductId(productId: number): Promise<ProductMaterial[]> {
        return await this.prisma.productMaterial.findMany({
            where: { productId },
            include: {
                rawMaterial: true,
                product: true
            }
        })
    }

    async findById(id: number): Promise<ProductMaterial | null> {
        return await this.prisma.productMaterial.findUnique({
            where: { id },
            include: {
                rawMaterial: true,
                product: true
            }
        })
    }

    async findByProductAndMaterial(productId: number, rawMaterialId: number): Promise<ProductMaterial | null> {
        return await this.prisma.productMaterial.findFirst({
            where: {
                productId,
                rawMaterialId
            }
        })
    }

    async updateProductMaterial(id: number, quantity: number): Promise<ProductMaterial> {
        return await this.prisma.productMaterial.update({
            where: { id },
            data: { quantity },
            include: {
                rawMaterial: true,
                product: true
            }
        })
    }

    async deleteProductMaterial(id: number): Promise<ProductMaterial> {
        return await this.prisma.productMaterial.delete({
            where: { id }
        })
    }
}

