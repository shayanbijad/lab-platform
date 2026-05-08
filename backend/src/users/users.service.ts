import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findByPhone(phone: string) {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  findAll(role?: UserRole) {
    return this.prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, data: { email?: string; phone?: string; role?: UserRole }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateRole(id: string, role: UserRole) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.delete({ where: { id } });
  }

  // --- Doctor User Management ---

  async createDoctorUser(dto: {
    email: string;
    phone: string;
    password: string;
    fullName: string;
    specialty?: string;
    licenseNumber?: string;
  }) {
    // Check if email already exists
    const existingEmail = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if phone already exists
    const existingPhone = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (existingPhone) {
      throw new ConflictException('Phone already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user and doctor profile in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          phone: dto.phone,
          password: hashedPassword,
          role: UserRole.DOCTOR,
        },
      });

      const profile = await tx.doctorProfile.create({
        data: {
          userId: user.id,
          fullName: dto.fullName,
          specialty: dto.specialty,
          licenseNumber: dto.licenseNumber,
          phone: dto.phone,
        },
      });

      return { user, profile };
    });

    return result;
  }

  async findAllDoctorUsers() {
    const users = await this.prisma.user.findMany({
      where: { role: UserRole.DOCTOR },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        doctorProfile: {
          select: {
            id: true,
            fullName: true,
            specialty: true,
            licenseNumber: true,
            phone: true,
          },
        },
      },
    });

    return users;
  }

  async findDoctorUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        doctorProfile: {
          select: {
            id: true,
            fullName: true,
            specialty: true,
            licenseNumber: true,
            phone: true,
          },
        },
      },
    });

    if (!user || user.role !== UserRole.DOCTOR) {
      throw new NotFoundException('Doctor user not found');
    }

    return user;
  }

  async updateDoctorUser(id: string, dto: {
    email?: string;
    phone?: string;
    fullName?: string;
    specialty?: string;
    licenseNumber?: string;
  }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || user.role !== UserRole.DOCTOR) {
      throw new NotFoundException('Doctor user not found');
    }

    // Check email uniqueness if changing
    if (dto.email && dto.email !== user.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (existing) throw new ConflictException('Email already in use');
    }

    // Check phone uniqueness if changing
    if (dto.phone && dto.phone !== user.phone) {
      const existing = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
      if (existing) throw new ConflictException('Phone already in use');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id },
        data: {
          ...(dto.email && { email: dto.email }),
          ...(dto.phone && { phone: dto.phone }),
        },
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const profileUpdateData: any = {};
      if (dto.fullName !== undefined) profileUpdateData.fullName = dto.fullName;
      if (dto.specialty !== undefined) profileUpdateData.specialty = dto.specialty;
      if (dto.licenseNumber !== undefined) profileUpdateData.licenseNumber = dto.licenseNumber;
      if (dto.phone !== undefined) profileUpdateData.phone = dto.phone;

      const profile = await tx.doctorProfile.update({
        where: { userId: id },
        data: profileUpdateData,
      });

      return { user: updatedUser, profile };
    });

    return result;
  }
}
