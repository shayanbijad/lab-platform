import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DoctorProfilesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { fullName: string; specialty?: string; licenseNumber?: string; phone?: string }) {
    return this.prisma.doctorProfile.create({
      data: {
        userId,
        fullName: data.fullName,
        specialty: data.specialty,
        licenseNumber: data.licenseNumber,
        phone: data.phone,
      },
    });
  }

  async findByUserId(userId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
      include: { user: { select: { id: true, email: true, phone: true, role: true } } },
    });
    if (!profile) throw new NotFoundException('Doctor profile not found');
    return profile;
  }

  async update(userId: string, data: { fullName?: string; specialty?: string; licenseNumber?: string; phone?: string }) {
    const profile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Doctor profile not found');
    return this.prisma.doctorProfile.update({
      where: { userId },
      data,
    });
  }
}
