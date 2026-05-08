import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '@prisma/client';

interface RegisterDto {
  email: string;
  password: string;
  phone: string;
  role?: UserRole;
}

interface LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  // Generic auth endpoints (backward compatibility)
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register({
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      role: dto.role || 'PATIENT',
    });
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  // Patient auth endpoints
  @Post('patient/register')
  registerPatient(@Body() dto: Omit<RegisterDto, 'role'>) {
    return this.auth.register({
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      role: 'PATIENT',
    });
  }

  @Post('patient/login')
  loginPatient(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  // Sampler auth endpoints
  @Post('sampler/register')
  registerSampler(@Body() dto: Omit<RegisterDto, 'role'>) {
    return this.auth.register({
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      role: 'SAMPLER',
    });
  }

  @Post('sampler/login')
  loginSampler(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  // Admin auth endpoints (LAB_ADMIN)
  @Post('admin/register')
  registerAdmin(@Body() dto: Omit<RegisterDto, 'role'>) {
    return this.auth.register({
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      role: 'LAB_ADMIN',
    });
  }

  @Post('admin/login')
  loginAdmin(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  // Doctor auth endpoints
  @Post('doctor/register')
  registerDoctor(@Body() dto: Omit<RegisterDto, 'role'>) {
    return this.auth.register({
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      role: 'DOCTOR',
    });
  }

  @Post('doctor/login')
  loginDoctor(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }
}

