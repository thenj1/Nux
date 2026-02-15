import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/prisma-config/prisma.service";

@Injectable()
export class UserRepository {
    constructor(private prisma: PrismaService) { }

    async findAll(skip: number, take: number, sort: 'asc' | 'desc' = 'desc'): Promise<{ data: User[]; total: number }> {
        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take,
                orderBy: {
                    id: sort
                }
            }),
            this.prisma.user.count()
        ])

        return { data, total }
    };

    async findData(filter: Prisma.UserWhereInput): Promise<User | null>{
        return await this.prisma.user.findFirst({
            where: filter
        })
    }

    async findById(id: number): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where:{
                id: Number(id)
            }
        })
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return await this.prisma.user.create({
            data
        })
    }

    async updateUser(data: Prisma.UserUpdateInput, id: number): Promise<User> {
        return await this.prisma.user.update({
            data: data,
            where: {
                id: Number(id)
            }
        })
    }

    async deleteUser(id: number): Promise<User> {
        return await this.prisma.user.delete({
            where: {
                id: Number(id)
            }
        })
    }
}