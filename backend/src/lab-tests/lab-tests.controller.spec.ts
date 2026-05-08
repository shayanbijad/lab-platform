import { Test, TestingModule } from '@nestjs/testing';
import { LabTestsController } from './lab-tests.controller';
import { LabTestsService } from './lab-tests.service';

describe('LabTestsController', () => {
  let controller: LabTestsController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabTestsController],
      providers: [
        {
          provide: LabTestsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<LabTestsController>(LabTestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
