import { Test, TestingModule } from '@nestjs/testing';
import { LabResultsController } from './lab-results.controller';

describe('LabResultsController', () => {
  let controller: LabResultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabResultsController],
    }).compile();

    controller = module.get<LabResultsController>(LabResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
