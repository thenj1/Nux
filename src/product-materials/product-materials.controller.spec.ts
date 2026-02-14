import { Test, TestingModule } from '@nestjs/testing';
import { ProductMaterialsController } from './product-materials.controller';

describe('ProductMaterialsController', () => {
  let controller: ProductMaterialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductMaterialsController],
    }).compile();

    controller = module.get<ProductMaterialsController>(ProductMaterialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
