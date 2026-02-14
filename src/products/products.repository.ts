import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma-config/prisma.service";
import { Prisma, Product } from "@prisma/client";

@Injectable()
export class ProductRepository {
    constructor(private prisma: PrismaService) { }

    async findAll(skip: number, take: number, sort: 'asc' | 'desc' = 'desc'): Promise<{ data: Product[], total: number }> {
        const [data, total] = await Promise.all([
            this.prisma.product.findMany({
                skip,
                take,
                orderBy: {
                    id: sort
                }
            }),
            this.prisma.product.count()
        ])

        return { data, total }
    }

    async findByName(skip: number, take: number, sort: 'asc' | 'desc' = 'desc', name: string): Promise<{ data: Product[], total: number }> {
        const [data, total] = await Promise.all([
            this.prisma.product.findMany({
                skip,
                take,
                orderBy: {
                    id: sort
                },
                where: {
                    name
                }
            }),
            this.prisma.product.count({
                where: {
                    name
                }
            })
        ])

        return { data, total }
    }

    async findByCod(cod: string): Promise<Product | null> {
        return await this.prisma.product.findUnique({
            where: {
                cod
            }
        })
    }

    async findById(id: number): Promise<Product | null> {
        return await this.prisma.product.findUnique({
            where: { id },
            include: { materials: { include: { rawMaterial: true } } }
        })
    }

    async createProduct(data: Prisma.ProductCreateInput): Promise<Product> {
        return await this.prisma.product.create({
            data
        })
    }

    async updateProduct(data: Prisma.ProductUpdateInput, id: number): Promise<Product> {
        return await this.prisma.product.update({
            data,
            where: {
                id: Number(id)
            }
        })
    }

    async deleteProduct(id: number): Promise<Product> {
        return await this.prisma.product.delete({
            where: {
                id: Number(id)
            }
        })
    }
}