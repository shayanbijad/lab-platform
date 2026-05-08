import { Controller, Get, Post, Put, Patch, Delete, Param, Body } from '@nestjs/common';
import { LabsService } from './labs.service';

interface CreateLabDto {
  name: string;
  address: string;
  phone: string;
}

interface UpdateLabDto {
  name?: string;
  address?: string;
  phone?: string;
}

@Controller('labs')
export class LabsController {
  constructor(private labsService: LabsService) {}

  @Get()
  findAll() {
    return this.labsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateLabDto) {
    return this.labsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLabDto) {
    return this.labsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labsService.delete(id);
  }
}
