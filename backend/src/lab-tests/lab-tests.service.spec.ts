import { Test, TestingModule } from '@nestjs/testing';
import { LabTestsService } from './lab-tests.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LabTestsService', () => {
  let service: LabTestsService;

  const mockPrisma = {
    labTest: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LabTestsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<LabTestsService>(LabTestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
