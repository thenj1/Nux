import { Test, TestingModule } from '@nestjs/testing';
import { ProductMaterialsService } from './product-materials.service';

describe('ProductMaterialsService', () => {
  let service: ProductMaterialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductMaterialsService],
    }).compile();

    service = module.get<ProductMaterialsService>(ProductMaterialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
