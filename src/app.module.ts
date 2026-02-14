import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma-config/prisma.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { RawMaterialsModule } from './raw-materials/raw-materials.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    PrismaModule, UsersModule, ProductsModule, RawMaterialsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
