import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from '@prisma/client';

interface CreateUserDto {
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
}

interface UpdateUserDto {
  email?: string;
  phone?: string;
}

interface CreateDoctorUserDto {
  email: string;
  phone: string;
  password: string;
  fullName: string;
  specialty?: string;
  licenseNumber?: string;
}

interface UpdateDoctorUserDto {
  email?: string;
  phone?: string;
  fullName?: string;
  specialty?: string;
  licenseNumber?: string;
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(@Query('role') role?: UserRole) {
    return this.usersService.findAll(role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    // Note: Frontend should hash password, or we do it here
    return this.usersService.create({
      email: dto.email,
      phone: dto.phone,
      password: dto.password, // Should be hashed by auth service
      role: dto.role || 'PATIENT',
    });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/role')
  updateRole(@Param('id') id: string, @Body() body: { role: UserRole }) {
    return this.usersService.updateRole(id, body.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  // --- Doctor User Management (admin creates doctor users) ---

  @Post('doctor')
  createDoctorUser(@Body() dto: CreateDoctorUserDto) {
    return this.usersService.createDoctorUser(dto);
  }

  @Get('doctor/all')
  findAllDoctorUsers() {
    return this.usersService.findAllDoctorUsers();
  }

  @Get('doctor/:id')
  findDoctorUser(@Param('id') id: string) {
    return this.usersService.findDoctorUser(id);
  }

  @Put('doctor/:id')
  updateDoctorUser(@Param('id') id: string, @Body() dto: UpdateDoctorUserDto) {
    return this.usersService.updateDoctorUser(id, dto);
  }
}
