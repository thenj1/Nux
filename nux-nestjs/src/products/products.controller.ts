import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('products')
export class ProductsController{
    constructor(private readonly productsService: ProductsService){ }

    @Get()
    @UseGuards(JwtAuthGuard)
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
    @UseGuards(JwtAuthGuard)
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
    @UseGuards(JwtAuthGuard)
    async findByCod(
        @Query('cod') cod: string
    ) {
        return await this.productsService.findByCod(cod)
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createProduct(
        @Body() createProductInput: CreateProductDto
    ) {
        return await this.productsService.createProduct(createProductInput)
    }

    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    async updateProduct(
        @Param('id') id: string,
        @Body() updateProductInput: UpdateProductDto
    ) {
        return await this.productsService.updateProduct(updateProductInput, Number(id))
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    async deleteProduct(
        @Param('id') id: string
    ) {
        return await this.productsService.deleteProduct(Number(id))
    }
}
