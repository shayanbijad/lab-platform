import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LabsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.LabCreateInput) {
    return this.prisma.lab.create({ data });
  }

  findAll() {
    return this.prisma.lab.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        createdAt: true,
      },
    });
  }

  findById(id: string) {
    return this.prisma.lab.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, data: Prisma.LabUpdateInput) {
    const lab = await this.prisma.lab.findUnique({ where: { id } });
    if (!lab) throw new NotFoundException('Lab not found');

    return this.prisma.lab.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        createdAt: true,
      },
    });
  }

  async delete(id: string) {
    const lab = await this.prisma.lab.findUnique({ where: { id } });
    if (!lab) throw new NotFoundException('Lab not found');

    return this.prisma.lab.delete({ where: { id } });
  }
}
