import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class LabTestsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.labTest.create({
      data,
      include: { preparationBlog: true },
    })
  }

  findAll() {
    return this.prisma.labTest.findMany({
      include: { preparationBlog: true },
    })
  }

  findOne(id: string) {
    return this.prisma.labTest.findUnique({
      where: { id },
      include: { preparationBlog: true },
    })
  }

  update(id: string, data: any) {
    const allowed: any = {}
    if (typeof data?.name === 'string') allowed.name = data.name
    if (typeof data?.code === 'string') allowed.code = data.code
    if (typeof data?.description === 'string' || data?.description === null)
      allowed.description = data.description
    if (typeof data?.category === 'string' || data?.category === null)
      allowed.category = data.category
    if (data?.price !== undefined) {
      const priceNumber =
        typeof data.price === 'number' ? data.price : parseFloat(data.price)
      if (!Number.isNaN(priceNumber)) allowed.price = priceNumber
    }
    if (data?.preparationBlogId !== undefined) {
      allowed.preparationBlogId = data.preparationBlogId === '' ? null : data.preparationBlogId
    }

    return this.prisma.labTest.update({
      where: { id },
      data: allowed,
      include: { preparationBlog: true },
    })
  }
}
