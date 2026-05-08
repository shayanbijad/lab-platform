import { Injectable, NotFoundException } from '@nestjs/common';
import { MissionStatus, OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMissionDto } from './dto/create-mission.dto';

@Injectable()
export class SamplerMissionsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateMissionDto) {
    return this.prisma.samplerMission.create({
      data: {
        orderId: dto.orderId,
        addressId: dto.address,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  findAll() {
    return this.prisma.samplerMission.findMany({
      include: this.missionInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findBySampler(samplerUserId: string) {
    return this.prisma.samplerMission.findMany({
      where: {
        samplerId: samplerUserId,
      },
      include: this.missionInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const mission = await this.prisma.samplerMission.findUnique({
      where: { id },
      include: this.missionInclude,
    });

    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    return mission;
  }

  async assignMission(missionId: string, samplerId: string) {
    const result = await this.prisma.$transaction(async (tx) => {
      const mission = await tx.samplerMission.update({
        where: { id: missionId },
        data: {
          samplerId,
          status: 'ASSIGNED',
        },
        include: this.missionInclude,
      });

      await tx.order.update({
        where: { id: mission.orderId },
        data: { status: OrderStatus.SCHEDULED },
      });

      return mission;
    });

    return result;
  }

  async startMission(missionId: string) {
    const result = await this.prisma.$transaction(async (tx) => {
      const mission = await tx.samplerMission.update({
        where: { id: missionId },
        data: {
          status: 'ASSIGNED',
        },
        include: this.missionInclude,
      });

      await tx.order.update({
        where: { id: mission.orderId },
        data: { status: OrderStatus.IN_PROGRESS },
      });

      return mission;
    });

    return result;
  }

  async updateStatus(missionId: string, status: MissionStatus) {
    const result = await this.prisma.$transaction(async (tx) => {
      const mission = await tx.samplerMission.update({
        where: { id: missionId },
        data: {
          status,
          collectedAt: status === 'COLLECTED' ? new Date() : null,
        },
        include: this.missionInclude,
      });

      await tx.order.update({
        where: { id: mission.orderId },
        data: { status: this.mapMissionStatusToOrderStatus(status) },
      });

      return mission;
    });

    return result;
  }

  private mapMissionStatusToOrderStatus(status: MissionStatus) {
    switch (status) {
      case 'ASSIGNED':
        return OrderStatus.SCHEDULED;
      case 'COLLECTED':
        return OrderStatus.COMPLETED;
      case 'CANCELLED':
        return OrderStatus.CANCELLED;
      default:
        return OrderStatus.CREATED;
    }
  }

  private missionInclude = {
    address: true,
    sampler: {
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
      },
    },
    order: {
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        address: true,
        orderTests: {
          include: {
            labTest: true,
          },
        },
      },
    },
  };
}
