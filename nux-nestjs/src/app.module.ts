import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma-config/prisma.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { RawMaterialsModule } from './raw-materials/raw-materials.module';
import { ProductMaterialsModule } from './product-materials/product-materials.module';
import { ProductionModule } from './production/production.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: 60000, limit: 10
      }]
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    ProductsModule,
    RawMaterialsModule,
    ProductMaterialsModule,
    ProductionModule
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }]
})
export class AppModule { }
