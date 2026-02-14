import { Module } from '@nestjs/common';
import { ProductMaterialsController } from './product-materials.controller';
import { ProductMaterialsService } from './product-materials.service';
import { ProductMaterialsRepository } from './product-materials.repository';

@Module({
    controllers: [ProductMaterialsController],
    providers: [ProductMaterialsService, ProductMaterialsRepository],
    exports: [ProductMaterialsService]
})
export class ProductMaterialsModule { }
