import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProductMaterialsController } from './product-materials.controller';
import { ProductMaterialsService } from './product-materials.service';
import { ProductMaterialsRepository } from './product-materials.repository';

@Module({
    imports: [JwtModule],
    controllers: [ProductMaterialsController],
    providers: [ProductMaterialsService, ProductMaterialsRepository],
    exports: [ProductMaterialsService]
})
export class ProductMaterialsModule { }
