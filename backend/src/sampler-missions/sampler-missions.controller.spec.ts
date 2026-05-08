import { Test, TestingModule } from '@nestjs/testing';
import { SamplerMissionsController } from './sampler-missions.controller';

describe('SamplerMissionsController', () => {
  let controller: SamplerMissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SamplerMissionsController],
    }).compile();

    controller = module.get<SamplerMissionsController>(SamplerMissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
