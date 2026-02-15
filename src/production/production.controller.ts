import { Controller, Get } from '@nestjs/common';
import { ProductionService } from './production.service';

@Controller('production')
export class ProductionController {
    constructor(private readonly productionService: ProductionService) { }

    @Get('suggestion')
    async getProductionSuggestion() {
        return await this.productionService.calculateProductionSuggestion();
    }
}
