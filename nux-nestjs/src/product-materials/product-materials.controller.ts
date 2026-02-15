import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductMaterialsService } from './product-materials.service';
import { CreateProductMaterialDto } from './dto/create-product-material.dto';
import { UpdateProductMaterialDto } from './dto/update-product-material.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('product-materials')
export class ProductMaterialsController {
    constructor(private readonly productMaterialsService: ProductMaterialsService) { }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async create(@Body() createDto: CreateProductMaterialDto) {
        return await this.productMaterialsService.create(createDto);
    }

    @Get('product/:productId')
    @UseGuards(JwtAuthGuard)
    async findByProductId(@Param('productId') productId: string) {
        return await this.productMaterialsService.findByProductId(Number(productId));
    }

    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateDto: UpdateProductMaterialDto
    ) {
        return await this.productMaterialsService.update(Number(id), updateDto);
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: string) {
        return await this.productMaterialsService.delete(Number(id));
    }
}
