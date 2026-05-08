import { Controller, Get, Post, Delete, Patch, Param, Body, Query } from '@nestjs/common';
import { SamplersService } from './samplers.service';

interface CreateSamplerDto {
  email: string;
  phone: string;
  password: string;
  city?: string;
  street?: string;
  building?: string;
  latitude?: number;
  longitude?: number;
}

interface UpdateAddressDto {
  city?: string;
  street?: string;
  building?: string;
  latitude?: number;
  longitude?: number;
}

interface UpdateSamplerProfileDto extends UpdateAddressDto {
  email?: string;
  phone?: string;
}

@Controller('samplers')
export class SamplersController {
  constructor(private readonly service: SamplersService) {}

  @Post()
  create(@Body() dto: CreateSamplerDto) {
    return this.service.createSampler(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('closest')
  async findClosest(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
  ) {
    const sampler = await this.service.findClosestSampler(
      parseFloat(latitude),
      parseFloat(longitude),
    );
    return sampler || { message: 'No sampler found in your area' };
  }

  @Get('by-user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.service.findByUserId(userId);
  }

  @Patch('by-user/:userId')
  updateByUser(@Param('userId') userId: string, @Body() dto: UpdateSamplerProfileDto) {
    return this.service.updateByUserId(userId, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id/address')
  updateAddress(@Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.service.updateAddress(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
