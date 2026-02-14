import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma-config/prisma.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { RawMaterialsModule } from './raw-materials/raw-materials.module';
import { ProductMaterialsController } from './product-materials/product-materials.controller';
import { ProductMaterialsService } from './product-materials/product-materials.service';
import { ProductMaterialsModule } from './product-materials/product-materials.module';
import { ProductionController } from './production/production.controller';
import { ProductionService } from './production/production.service';
import { ProductionModule } from './production/production.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    PrismaModule, UsersModule, ProductsModule, RawMaterialsModule, ProductMaterialsModule, ProductionModule],
  controllers: [ProductMaterialsController, ProductionController],
  providers: [ProductMaterialsService, ProductionService],
})
export class AppModule { }
