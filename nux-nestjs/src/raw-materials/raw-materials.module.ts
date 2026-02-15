import { Module } from '@nestjs/common';
import { RawMaterialsService } from './raw-materials.service';
import { RawMaterialsController } from './raw-materials.controller';
import { RawMaterialsRepository } from './raw-materials.repository';

@Module({
  providers: [RawMaterialsService, RawMaterialsRepository] ,
  controllers: [RawMaterialsController],
  exports: [RawMaterialsService]
})
export class RawMaterialsModule {}
