import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from './patients.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PatientsService', () => {
  let service: PatientsService;

  const mockPrisma = {
    patient: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
