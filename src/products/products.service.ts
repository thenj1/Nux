import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './products.repository';
import { UpdateProduct } from './dto/update-product.dto';
import { CreateProduct } from './dto/create-product.dto';
import { PaginatedResponse, ProductResponse } from './dto/product-response.dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private productRepository: ProductRepository) { }
    async findAll(pages: number, limit: number, sort: 'asc' | 'desc' = 'desc'): Promise<PaginatedResponse<ProductResponse>> {
        const skip = (pages - 1) * limit;

        const { data: products, total } = await this.productRepository.findAll(skip, limit, sort)
        if (total == 0) {
            throw new NotFoundException('Nenhuma produto cadastrado')
        }

        const totalPages = Math.ceil(total / limit)

        return {
            data: products,
            meta: {
                pages,
                limit,
                total,
                totalPages
            }
        }
    }

    async findByName(pages: number, limit: number, sort: 'asc' | 'desc' = 'desc', name: string): Promise<PaginatedResponse<ProductResponse>> {
        const skip = (pages - 1) * limit;

        const { data: products, total } = await this.productRepository.findByName(skip, limit, sort, name)
        if (total == 0) {
            throw new NotFoundException('Nenhuma produto cadastrado')
        }

        const totalPages = Math.ceil(total / limit)

        return {
            data: products,
            meta: {
                pages,
                limit,
                total,
                totalPages
            }
        }
    }

    async findByCod(cod: string): Promise<ProductResponse> {
        const product = await this.productRepository.findByCod(cod);
        if (!product) {
            throw new NotFoundException('Produto não encontrado')
        }

        return product;
    }

    async createProduct(data: CreateProduct): Promise<ProductResponse> {
        const { name, cod, price } = data;

        const codExists = await this.productRepository.findByCod(cod);
        if (codExists) {
            throw new ConflictException('Product code already exists')
        }

        const product = await this.productRepository.createProduct({
            name,
            cod,
            price
        })

        return product;
    }

    async updateProduct(data: UpdateProduct, id: number): Promise<ProductResponse> {
        const { name, cod, price } = data;
        const productFound = await this.productRepository.findById(id)
        if (!productFound) {
            throw new NotFoundException('Produto não encontrado')
        }

        const product = await this.productRepository.updateProduct({
            name: name || productFound.name,
            cod: cod || productFound.cod,
            price: price || productFound.price
        }, id)

        return product;
    }

    async deleteProduct(id: number): Promise<{ message: string }> {
        const productExists = await this.productRepository.findById(id)
        if (!productExists) {
            throw new NotFoundException('Produto não encontrado')
        }

        await this.productRepository.deleteProduct(id)

        return { message: 'Produto deletado com sucesso' }
    }
}
