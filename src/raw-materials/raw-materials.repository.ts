import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma-config/prisma.service";
import { Prisma, RawMaterial } from "@prisma/client"

@Injectable()
export class RawMaterialsRepository {
    constructor(private prisma: PrismaService) { }

    async createRawMaterial(data: Prisma.RawMaterialCreateInput): Promise<RawMaterial> {
        return this.prisma.rawMaterial.create({ data });
    }

    async findAll(skip: number, take: number, sort: 'asc' | 'desc' = 'desc'): Promise<{ data: RawMaterial[], total: number}> {
        const [data, total] = await Promise.all([
            this.prisma.rawMaterial.findMany({
                skip,
                take,
                orderBy: {
                    name: sort
                }
            }),
            this.prisma.rawMaterial.count()
        ])

        return {data, total}
    }

    async findByName(skip: number, take: number, sort: 'asc' | 'desc' = 'desc', name: string): Promise<{ data: RawMaterial[], total: number }> {
        const [data, total] = await Promise.all([
            this.prisma.rawMaterial.findMany({
                skip,
                take,
                orderBy: {
                    id: sort
                },
                where: {
                    name
                }
            }),
            this.prisma.rawMaterial.count({
                where: {
                    name
                }
            })
        ])

        return { data, total }
    }

    async findById(id: number): Promise<RawMaterial | null> {
        return await this.prisma.rawMaterial.findUnique({
            where:{
                id: Number(id)
            }
        })
    }

    async updateProduct(data: Prisma.ProductUpdateInput, id: number): Promise<RawMaterial> {
        return await this.prisma.rawMaterial.update({
            data,
            where: {
                id: Number(id)
            }
        })
    }

    async deleteProduct(id: number): Promise<RawMaterial> {
        return await this.prisma.rawMaterial.delete({
            where: {
                id: Number(id)
            }
        })
    }
}