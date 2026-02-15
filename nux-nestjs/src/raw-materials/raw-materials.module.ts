import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RawMaterialsService } from './raw-materials.service';
import { RawMaterialsController } from './raw-materials.controller';
import { RawMaterialsRepository } from './raw-materials.repository';

@Module({
  imports: [JwtModule],
  providers: [RawMaterialsService, RawMaterialsRepository],
  controllers: [RawMaterialsController],
  exports: [RawMaterialsService]
})
export class RawMaterialsModule { }
