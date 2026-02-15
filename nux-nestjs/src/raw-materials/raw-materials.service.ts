import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RawMaterialsRepository } from './raw-materials.repository';
import { CreateRawMaterialDto } from './dto/create-raw.dto';
import { UpdateRawMaterialDto } from './dto/update-raw.dto';
import { RawMaterialResponseDto } from './dto/raw-response.dto';
import { PaginatedResponse } from './dto/raw-response.dto';

@Injectable()
export class RawMaterialsService{
    constructor(private rawMaterialRepository: RawMaterialsRepository){ }

    async findAll(pages: number, limit: number, sort: 'asc' | 'desc' = 'desc'): Promise<PaginatedResponse<RawMaterialResponseDto>> {
        const skip = (pages - 1) * limit;

        const { data: rawMaterial, total } = await this.rawMaterialRepository.findAll(skip, limit, sort)
        if (total == 0) {
            throw new NotFoundException('No raw materials found')
        }

        const totalPages = Math.ceil(total / limit)

        return {
            data: rawMaterial,
            meta: {
                pages,
                limit,
                total,
                totalPages
            }
        }
    }

    async findByName(pages: number, limit: number, sort: 'asc' | 'desc' = 'desc', name: string): Promise<PaginatedResponse<RawMaterialResponseDto>> {
        const skip = (pages - 1) * limit;

        const { data: rawMaterial, total } = await this.rawMaterialRepository.findByName(skip, limit, sort, name)
        if (total == 0) {
            throw new NotFoundException('No raw materials found')
        }

        const totalPages = Math.ceil(total / limit)

        return {
            data: rawMaterial,
            meta: {
                pages,
                limit,
                total,
                totalPages
            }
        }
    }

    async createRawMaterial(data: CreateRawMaterialDto): Promise<RawMaterialResponseDto> {
        const { name, cod, stock } = data;

        const codExists = await this.rawMaterialRepository.findByCod(cod);
        if (codExists) {
            throw new ConflictException('Raw Material code already exists')
        }

        const rawMaterial = await this.rawMaterialRepository.createRawMaterial({
            name,
            cod,
            stock
        })

        return rawMaterial;
    }

    async findByCode(cod: string): Promise<RawMaterialResponseDto> {
        const rawMaterial = await this.rawMaterialRepository.findByCod(cod)

        if(!rawMaterial){
            throw new NotFoundException('Raw material not found')
        }

        return rawMaterial
    }

    async updateRawMaterial(data: UpdateRawMaterialDto, id: number): Promise<RawMaterialResponseDto> {
        const { name, cod, stock } = data;
        const rawMaterialFound = await this.rawMaterialRepository.findById(id)
        if (!rawMaterialFound) {
            throw new NotFoundException('raw material not found')
        }

        const rawMaterial = await this.rawMaterialRepository.updateRawMaterial({
            name: name || rawMaterialFound.name,
            cod: cod || rawMaterialFound.cod,
            stock: stock || rawMaterialFound.stock
        },id)

        return rawMaterial;
    }

    async deleteRawMaterial(id: number): Promise<{ message: string }> {
        const rawMaterialExists = await this.rawMaterialRepository.findById(id)
        if (!rawMaterialExists) {
            throw new NotFoundException('raw material not found')
        }

        await this.rawMaterialRepository.deleteRawMaterial(id)

        return { message: 'raw material deleted successfully' }
    }
}
