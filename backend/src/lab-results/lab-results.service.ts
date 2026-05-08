import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@Injectable()
export class LabResultsService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  create(dto: CreateResultDto) {
    return this.prisma.result.create({ data: dto });
  }

  findAll() {
    return this.prisma.result.findMany({
      include: {
        orderTest: {
          include: {
            labTest: true,
            order: {
              include: {
                patient: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.result.findUnique({
      where: { id },
      include: {
        orderTest: {
          include: {
            labTest: true,
            order: {
              include: {
                patient: true,
              },
            },
          },
        },
      },
    });
  }

  async uploadFile(id: string, file: any) {
    const result = await this.prisma.result.findUnique({ where: { id } });
    if (!result) throw new NotFoundException('Result not found');

    // Upload file to MinIO storage
    const fileName = `results/${id}/${Date.now()}-${file.originalname}`;
    const uploaded = await this.storage.upload(
      fileName,
      file.buffer,
      file.mimetype,
    );

    // Update result with file URL (store in value field for now)
    return this.prisma.result.update({
      where: { id },
      data: { value: uploaded.url },
    });
  }

  async removeFile(id: string) {
    const result = await this.prisma.result.findUnique({ where: { id } });
    if (!result) throw new NotFoundException('Result not found');

    const url = result.value || '';
    const prefix = 'http://localhost:9000/lab-files/';
    if (url.startsWith(prefix)) {
      const objectName = url.slice(prefix.length);
      if (objectName) {
        await this.storage.remove(objectName);
      }
    }

    return this.prisma.result.update({
      where: { id },
      data: { value: '' },
    });
  }

  update(id: string, dto: UpdateResultDto) {
    return this.prisma.result.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.result.delete({ where: { id } });
  }
}
