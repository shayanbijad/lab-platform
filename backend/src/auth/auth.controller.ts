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

  // Generic auth endpoints (optional / backward compatibility)
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register({
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      role: dto.role || UserRole.PATIENT,
    });
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login({
      ...dto,
      role: UserRole.PATIENT,
    });
  }

  // PATIENT
  @Post('patient/register')
  registerPatient(@Body() dto: Omit<RegisterDto, 'role'>) {
    return this.auth.register({
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      role: UserRole.PATIENT,
    });
  }

  @Post('patient/login')
  loginPatient(@Body() dto: LoginDto) {
    return this.auth.login({
      ...dto,
      role: UserRole.PATIENT,
    });
  }

  // SAMPLER
  @Post('sampler/register')
  registerSampler(@Body() dto: Omit<RegisterDto, 'role'>) {
    return this.auth.register({
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      role: UserRole.SAMPLER,
    });
  }

  @Post('sampler/login')
  loginSampler(@Body() dto: LoginDto) {
    console.log('SAMPLER LOGIN ROUTE HIT');
    return this.auth.login({
      ...dto,
      role: UserRole.SAMPLER,
    });
  }


  // ADMIN
  @Post('admin/register')
  registerAdmin(@Body() dto: Omit<RegisterDto, 'role'>) {
    return this.auth.register({
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      role: UserRole.LAB_ADMIN,
    });
  }

  @Post('admin/login')
  loginAdmin(@Body() dto: LoginDto) {
    return this.auth.login({
      ...dto,
      role: UserRole.LAB_ADMIN,
    });
  }
}
