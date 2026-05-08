import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAddressDto) {
    return this.prisma.address.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.address.findMany({
      include: {
        patient: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.address.findUnique({
      where: { id },
    });
  }

  findPatientAddresses(patientId: string) {
    return this.prisma.address.findMany({
      where: { patientId },
    });
  }

  update(id: string, dto: UpdateAddressDto) {
    return this.prisma.address.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.address.delete({
      where: { id },
    });
  }
}
