import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma, UserRole } from '@prisma/client';

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
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  // REGISTER
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
        role: dto.role,
        phone: dto.phone,
      });

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
        token,
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

  // LOGIN
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

    if (user.role !== dto.role) {
      throw new UnauthorizedException('Invalid role for this login portal');
    }

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
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    };
  }
}
