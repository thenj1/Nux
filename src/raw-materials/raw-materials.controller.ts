import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RawMaterialsService } from './raw-materials.service';
import { CreateRawMaterialDto } from './dto/create-raw.dto';
import { UpdateRawMaterialDto } from './dto/update-raw.dto';

@Controller('raw-materials')
export class RawMaterialsController{
    constructor(private readonly rawMaterialService: RawMaterialsService){ }

    @Get()
    async findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '20',
        @Query('sort') sort: 'asc' | 'desc' = 'desc'
    ) {
        const pageSafe = Math.max(1, parseInt(page) || 1);
        const limitSafe = Math.min(100, Math.max(1, parseInt(limit) || 20))

        return await this.rawMaterialService.findAll(pageSafe, limitSafe, sort)
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

        return await this.rawMaterialService.findByName(pageSafe, limitSafe, sort, name)
    }

    @Get('find/cod')
    async findByCod(
        @Query('cod') cod: string
    ) {
        return await this.rawMaterialService.findByCode(cod)
    }


    @Post('create')
    async createRawMaterial(
        @Body() createRawMaterialInput: CreateRawMaterialDto
    ) {
        return await this.rawMaterialService.createRawMaterial(createRawMaterialInput)
    }

    @Put('update/:id')
    async updateRawMaterial(
        @Param('id') id: string,
        @Body() updateRawMaterialInput: UpdateRawMaterialDto
    ) {
        return await this.rawMaterialService.updateRawMaterial(updateRawMaterialInput, Number(id))
    }

    @Delete('delete/:id')
    async deleteRawMaterial(
        @Param('id') id: string
    ) {
        return await this.rawMaterialService.deleteRawMaterial(Number(id))
    }
}
