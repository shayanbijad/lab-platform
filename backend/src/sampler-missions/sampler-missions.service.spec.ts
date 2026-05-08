import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatus } from '@prisma/client';
import { SamplerMissionsService } from './sampler-missions.service.ts';
import { PrismaService } from '../prisma/prisma.service';

describe('SamplerMissionsService', () => {
  let service: SamplerMissionsService;
  const missionUpdate = jest.fn();
  const orderUpdate = jest.fn();
  const mockPrisma = {
    $transaction: jest.fn((callback: (tx: any) => Promise<any>) =>
      callback({
        samplerMission: {
          update: missionUpdate,
        },
        order: {
          update: orderUpdate,
        },
      }),
    ),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    missionUpdate.mockResolvedValue({
      id: 'mission-1',
      orderId: 'order-1',
      status: 'COLLECTED',
      collectedAt: new Date('2025-01-01T00:00:00.000Z'),
    });
    orderUpdate.mockResolvedValue({
      id: 'order-1',
      status: OrderStatus.COMPLETED,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SamplerMissionsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<SamplerMissionsService>(SamplerMissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('marks the order as completed when a mission is collected', async () => {
    const result = await service.updateStatus('mission-1', 'COLLECTED');

    expect(mockPrisma.$transaction).toHaveBeenCalled();
    expect(missionUpdate).toHaveBeenCalledWith({
      where: { id: 'mission-1' },
      data: {
        status: 'COLLECTED',
        collectedAt: expect.any(Date),
      },
      include: expect.any(Object),
    });
    expect(orderUpdate).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: { status: OrderStatus.COMPLETED },
    });
    expect(result.status).toBe('COLLECTED');
  });
});
