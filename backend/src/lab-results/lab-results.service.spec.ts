import { Test, TestingModule } from '@nestjs/testing';
import { LabResultsService } from './lab-results.service';

describe('LabResultsService', () => {
  let service: LabResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LabResultsService],
    }).compile();

    service = module.get<LabResultsService>(LabResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
