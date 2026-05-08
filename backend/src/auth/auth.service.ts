import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface RegisterDto {
  email: string;
  password: string;
  role: UserRole;
  phone: string;
}

interface LoginDto {
  email?: string;
  phone?: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.users.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.users.create({
        email: dto.email,
        password: hashed,
        role: dto.role ?? UserRole.PATIENT,
        phone: dto.phone,
      });

      await this.ensureRoleProfile(user.id, user.role);

      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const token = await this.jwt.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      });

      return {
        token: token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      };
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Phone already exists');
      }

      throw e;
    }
  }

  async login(dto: LoginDto) {
    let user;
    if (dto.email) {
      user = await this.users.findByEmail(dto.email);
    } else if (dto.phone) {
      user = await this.users.findByPhone(dto.phone);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.ensureRoleProfile(user.id, user.role);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    return {
      token: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    };
  }

  private async ensureRoleProfile(userId: string, role: UserRole) {
    if (role === UserRole.PATIENT) {
      const patient = await this.prisma.patient.findUnique({ where: { userId } });
      if (!patient) {
        await this.prisma.patient.create({
          data: {
            userId,
          },
        });
      }
      return;
    }

    if (role === UserRole.SAMPLER) {
      const sampler = await this.prisma.sampler.findUnique({ where: { userId } });
      if (!sampler) {
        await this.prisma.sampler.create({
          data: {
            userId,
          },
        });
      }
    }

    if (role === UserRole.DOCTOR) {
      const profile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
      if (!profile) {
        await this.prisma.doctorProfile.create({
          data: {
            userId,
            fullName: 'Doctor',
          },
        });
      }
    }
  }
}

