import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

interface CreateSamplerDto {
  email: string;
  phone: string;
  password: string;
  city?: string;
  street?: string;
  building?: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface UpdateSamplerProfileDto {
  email?: string;
  phone?: string;
  city?: string;
  street?: string;
  building?: string;
  latitude?: number | null;
  longitude?: number | null;
}

@Injectable()
export class SamplersService {
  constructor(private prisma: PrismaService) {}

  async createSampler(dto: CreateSamplerDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        role: 'SAMPLER',
      },
    });

    const sampler = await this.prisma.sampler.create({
      data: {
        userId: user.id,
        city: dto.city,
        street: dto.street,
        building: dto.building,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
    });

    return {
      message: 'Sampler created successfully',
      sampler: {
        id: sampler.id,
        userId: user.id,
        email: user.email,
        phone: user.phone,
        city: sampler.city,
        latitude: sampler.latitude,
        longitude: sampler.longitude,
      },
    };
  }

  async findAll() {
    return this.prisma.sampler.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    const sampler = await this.prisma.sampler.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
      },
    });

    if (!sampler) {
      throw new NotFoundException('Sampler not found');
    }

    return sampler;
  }

  async findByUserId(userId: string) {
    const sampler = await this.prisma.sampler.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    return sampler;
  }

  async findClosestSampler(latitude: number, longitude: number) {
    const samplers = await this.prisma.sampler.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (samplers.length === 0) {
      return null;
    }

    const samplerDist = samplers
      .filter((sampler) => sampler.latitude !== null && sampler.longitude !== null)
      .map((sampler) => ({
        ...sampler,
        distance: this.calculateDistance(
          latitude,
          longitude,
          sampler.latitude as number,
          sampler.longitude as number,
        ),
      }));

    samplerDist.sort((a, b) => a.distance - b.distance);
    return samplerDist[0];
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async updateAddress(id: string, data: {
    city?: string;
    street?: string;
    building?: string;
    latitude?: number | null;
    longitude?: number | null;
  }) {
    const sampler = await this.prisma.sampler.findUnique({ where: { id } });

    if (!sampler) {
      throw new NotFoundException('Sampler not found');
    }

    return this.prisma.sampler.update({
      where: { id },
      data,
    });
  }

  async updateByUserId(userId: string, data: UpdateSamplerProfileDto) {
    const locationData = {
      city: data.city,
      street: data.street,
      building: data.building,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
    };

    const sampler = await this.prisma.sampler.upsert({
      where: { userId },
      update: locationData,
      create: {
        userId,
        ...locationData,
      },
    });

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: data.email,
        phone: data.phone,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return {
      ...sampler,
      user,
    };
  }

  async delete(id: string) {
    const sampler = await this.prisma.sampler.findUnique({ where: { id } });

    if (!sampler) {
      throw new NotFoundException('Sampler not found');
    }

    await this.prisma.sampler.delete({ where: { id } });
    await this.prisma.user.delete({ where: { id: sampler.userId } });

    return { message: 'Sampler deleted successfully' };
  }
}
