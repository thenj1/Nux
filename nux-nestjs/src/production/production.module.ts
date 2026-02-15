import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProductionController } from './production.controller';
import { ProductionService } from './production.service';

@Module({
  imports: [JwtModule],
  controllers: [ProductionController],
  providers: [ProductionService]
})
export class ProductionModule { }
