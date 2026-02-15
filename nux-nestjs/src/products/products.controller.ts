import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController{
    constructor(private readonly productsService: ProductsService){ }

    @Get()
    async findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '20',
        @Query('sort') sort: 'asc' | 'desc' = 'desc'
    ) {
        const pageSafe = Math.max(1, parseInt(page) || 1);
        const limitSafe = Math.min(100, Math.max(1, parseInt(limit) || 20))

        return await this.productsService.findAll(pageSafe, limitSafe, sort)
    }

    @Get('find/name')
    async findByName(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '20',
        @Query('sort') sort: 'asc' | 'desc' = 'desc',
        @Query('name') name: string
    ) {
        const pageSafe = Math.max(1, parseInt(page) || 1);
        const limitSafe = Math.min(100, Math.max(1, parseInt(limit) || 20))

        return await this.productsService.findByName(pageSafe, limitSafe, sort, name)
    }

    @Get('find/cod')
    async findByCod(
        @Query('cod') cod: string
    ) {
        return await this.productsService.findByCod(cod)
    }

    @Post('create')
    async createProduct(
        @Body() createProductInput: CreateProductDto
    ) {
        return await this.productsService.createProduct(createProductInput)
    }

    @Put('update/:id')
    async updateProduct(
        @Param('id') id: string,
        @Body() updateProductInput: UpdateProductDto
    ) {
        return await this.productsService.updateProduct(updateProductInput, Number(id))
    }

    @Delete('delete/:id')
    async deleteProduct(
        @Param('id') id: string
    ) {
        return await this.productsService.deleteProduct(Number(id))
    }
}
