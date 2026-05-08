import { Injectable } from '@nestjs/common';
import { OrderStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async createOrderFromWizard(userId: string, testIds: string[], wizardData?: any) {
    let patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      patient = await this.prisma.patient.create({
        data: {
          userId,
          firstName: wizardData?.firstName || 'Patient',
          lastName: wizardData?.lastName || userId.substring(0, 8),
          nationalId: wizardData?.nationalId || `temp_${userId}`,
          birthDate: new Date(),
          gender: wizardData?.gender || 'unknown',
        },
      });
    } else if (wizardData) {
      patient = await this.prisma.patient.update({
        where: { id: patient.id },
        data: {
          firstName: patient.firstName || wizardData.firstName,
          lastName: patient.lastName || wizardData.lastName,
          nationalId: patient.nationalId || wizardData.nationalId,
          gender: patient.gender || wizardData.gender,
        },
      });
    }

    const addressPayload = wizardData?.address || wizardData || {};
    const hasAddressDetails = Boolean(
      addressPayload?.city ||
        addressPayload?.street ||
        addressPayload?.building ||
        addressPayload?.latitude !== undefined ||
        addressPayload?.longitude !== undefined,
    );

    const address = hasAddressDetails
      ? await this.prisma.address.create({
          data: {
            patientId: patient.id,
            label: addressPayload?.label || 'Selected in wizard',
            city: addressPayload?.city || 'Unknown',
            street: addressPayload?.street || 'Unknown',
            building: addressPayload?.building || undefined,
            latitude: addressPayload?.latitude,
            longitude: addressPayload?.longitude,
          },
        })
      : await this.prisma.address.findFirst({
          where: { patientId: patient.id },
          orderBy: { createdAt: 'desc' },
        });

    if (!address) {
      throw new Error('Address is required to create an order');
    }

    return this.createOrder(patient.id, address.id, testIds, wizardData);
  }

  async createOrder(patientId: string, addressId: string, testIds: string[], wizardData?: any) {
    const createdOrder = await this.prisma.order.create({
      data: {
        patientId,
        addressId,
        prescriptionFileUrl: wizardData?.prescription?.fileUrl || undefined,
        prescriptionFileName: wizardData?.prescription?.fileName || undefined,
        prescriptionCode: wizardData?.prescription?.digitalCode || undefined,
        orderTests: {
          create: testIds.map((id) => ({
            testId: id,
          })),
        },
      },
      include: {
        orderTests: true,
        address: true,
      },
    });

    await this.createMissionForOrder(createdOrder.id, addressId);

    return this.prisma.order.findUnique({
      where: { id: createdOrder.id },
      include: {
        orderTests: {
          include: {
            labTest: true,
          },
        },
        address: true,
        patient: {
          include: {
            user: true,
          },
        },
        missions: {
          include: {
            sampler: true,
          },
        },
      },
    });
  }

  async uploadPrescription(file: any) {
    const fileName = `prescriptions/${Date.now()}-${file.originalname}`;
    const uploaded = await this.storage.upload(
      fileName,
      file.buffer,
      file.mimetype,
    );

    return {
      url: uploaded.url,
      fileName: file.originalname,
      mimeType: file.mimetype,
    };
  }

  async findOne(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderTests: {
          include: {
            labTest: true,
            result: true,
          },
        },
        address: true,
        patient: {
          include: {
            user: true,
          },
        },
        missions: {
          include: {
            sampler: true,
          },
        },
      },
    });
  }

  async findOrdersByPatientId(patientId: string) {
    return this.prisma.order.findMany({
      where: { patientId },
      include: {
        orderTests: {
          include: {
            labTest: true,
            result: true,
          },
        },
        address: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        orderTests: {
          include: {
            labTest: true,
            result: true,
          },
        },
        address: true,
        patient: {
          include: {
            user: true,
          },
        },
        missions: {
          include: {
            sampler: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    const allowed = new Set<OrderStatus>([
      OrderStatus.CREATED,
      OrderStatus.SCHEDULED,
      OrderStatus.IN_PROGRESS,
      OrderStatus.COMPLETED,
      OrderStatus.CANCELLED,
    ]);
    if (!allowed.has(status)) {
      throw new Error('Invalid status');
    }
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  private async createMissionForOrder(orderId: string, addressId: string) {
    const address = await this.prisma.address.findUnique({ where: { id: addressId } });

    if (!address) {
      return null;
    }

    const samplerUserId = await this.findBestSamplerUserId(address.latitude, address.longitude);
    const mission = await this.prisma.samplerMission.create({
      data: {
        orderId,
        addressId,
        scheduledAt: new Date(),
        samplerId: samplerUserId || undefined,
        status: samplerUserId ? 'ASSIGNED' : 'PENDING',
      },
    });

    if (samplerUserId) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.SCHEDULED },
      });
    }

    return mission;
  }

  private async findBestSamplerUserId(latitude?: number | null, longitude?: number | null) {
    const samplerProfiles = await this.prisma.sampler.findMany({
      include: {
        user: {
          select: {
            id: true,
            role: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        user: {
          createdAt: 'asc',
        },
      },
    });

    const activeSamplerProfiles = samplerProfiles.filter(
      (sampler) => sampler.user?.role === UserRole.SAMPLER,
    );

    if (
      latitude !== null &&
      latitude !== undefined &&
      longitude !== null &&
      longitude !== undefined
    ) {
      const nearby = activeSamplerProfiles
        .filter((sampler) => sampler.latitude !== null && sampler.longitude !== null)
        .map((sampler) => ({
          userId: sampler.userId,
          distance: this.calculateDistance(
            latitude,
            longitude,
            sampler.latitude as number,
            sampler.longitude as number,
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      if (nearby.length > 0) {
        return nearby[0].userId;
      }
    }

    if (activeSamplerProfiles.length > 0) {
      return activeSamplerProfiles[0].userId;
    }

    const fallbackSamplerUser = await this.prisma.user.findFirst({
      where: { role: UserRole.SAMPLER },
      orderBy: { createdAt: 'asc' },
    });

    return fallbackSamplerUser?.id || null;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
