import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto'

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.patient.findMany({
      include: {
        user: {
          select: { id: true, phone: true, email: true },
        },
        addresses: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async create(userId: string, data: any) {
    return this.prisma.patient.create({
      data: {
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        nationalId: data.nationalId,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        age: data.age,
        gender: data.gender,
        insuranceId: data.insuranceId,
        insuranceType: data.insuranceType,
        medicalConditions: data.medicalConditions || [],
        profileCompleted: Boolean(data.profileCompleted),
      },
    })
  }

  async ensurePatientProfile(userId: string) {
    const existing = await this.prisma.patient.findUnique({
      where: { userId },
    })

    if (existing) {
      return existing
    }

    return this.prisma.patient.create({
      data: { userId },
    })
  }

  // Get patient by patient ID
  async getPatientById(patientId: string) {
    return this.prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: {
          select: { id: true, phone: true, email: true }
        },
        addresses: true,
      },
    })
  }

  // Get patient by user ID
  async getPatientByUserId(userId: string) {
    return this.prisma.patient.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, phone: true, email: true }
        },
        addresses: true,
      },
    })
  }

  async upsertProfileByUserId(userId: string, dto: UpdatePatientProfileDto) {
    const birthDate =
      dto.age !== undefined
        ? this.estimateBirthDate(dto.age)
        : undefined

    const patient = await this.prisma.patient.upsert({
      where: { userId },
      create: {
        userId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        nationalId: dto.nationalId,
        age: dto.age,
        birthDate,
        gender: dto.gender,
        insuranceId: dto.insuranceId,
        insuranceType: dto.insuranceType,
        medicalConditions: dto.medicalConditions || [],
        profileCompleted: this.isProfileCompleted(dto),
      },
      update: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        nationalId: dto.nationalId,
        age: dto.age,
        birthDate,
        gender: dto.gender,
        insuranceId: dto.insuranceId,
        insuranceType: dto.insuranceType,
        medicalConditions: dto.medicalConditions,
        profileCompleted: this.isProfileCompleted(dto),
      },
    })

    if (dto.address) {
      await this.upsertPrimaryAddress(patient.id, dto.address)
    }

    return this.getPatientByUserId(userId)
  }

  private async upsertPrimaryAddress(patientId: string, address: UpdatePatientProfileDto['address']) {
    const hasAddressData = Boolean(
      address?.city ||
        address?.street ||
        address?.building ||
        address?.unit ||
        address?.latitude !== undefined ||
        address?.longitude !== undefined,
    )

    if (!hasAddressData) {
      return
    }

    const existingAddress = await this.prisma.address.findFirst({
      where: {
        patientId,
        label: 'profile-primary',
      },
    })

    const payload = {
      label: 'profile-primary',
      city: address?.city || '',
      street: address?.street || '',
      building: address?.building || undefined,
      unit: address?.unit || undefined,
      latitude: address?.latitude,
      longitude: address?.longitude,
    }

    if (existingAddress) {
      await this.prisma.address.update({
        where: { id: existingAddress.id },
        data: payload,
      })
      return
    }

    await this.prisma.address.create({
      data: {
        patientId,
        ...payload,
      },
    })
  }

  private estimateBirthDate(age: number) {
    const birthDate = new Date()
    birthDate.setFullYear(birthDate.getFullYear() - age)
    return birthDate
  }

  private isProfileCompleted(dto: UpdatePatientProfileDto) {
    const hasAddress = Boolean(dto.address?.city && dto.address?.street)

    return Boolean(
      dto.firstName &&
        dto.lastName &&
        dto.age !== undefined &&
        dto.gender &&
        dto.insuranceType &&
        dto.insuranceId &&
        hasAddress,
    )
  }
}
