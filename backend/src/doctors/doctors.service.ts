import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class DoctorsService {

  constructor(private prisma: PrismaService) {}

  create(data: Prisma.DoctorCreateInput) {
    return this.prisma.doctor.create({
      data
    })
  }
async update(id: number, data: any) {
  return this.prisma.doctor.update({
    where: { id },
    data,
  })
}

  findAll() {
    return this.prisma.doctor.findMany()
  }

  findOne(id: number) {
    return this.prisma.doctor.findUnique({
      where: { id }
    })
  }
}
