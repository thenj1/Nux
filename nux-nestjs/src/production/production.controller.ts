import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProductionService } from './production.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('production')
export class ProductionController {
    constructor(private readonly productionService: ProductionService) { }

    @Get('suggestion')
    @UseGuards(JwtAuthGuard)
    async getProductionSuggestion() {
        return await this.productionService.calculateProductionSuggestion();
    }
}
