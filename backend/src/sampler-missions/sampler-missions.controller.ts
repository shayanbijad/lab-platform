import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MissionStatus } from '@prisma/client';
import { SamplerMissionsService } from './sampler-missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';

@Controller('missions')
export class SamplerMissionsController {
  constructor(private readonly service: SamplerMissionsService) {}

  @Post()
  create(@Body() dto: CreateMissionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('by-sampler/:samplerUserId')
  findBySampler(@Param('samplerUserId') samplerUserId: string) {
    return this.service.findBySampler(samplerUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id/assign/:samplerId')
  assign(@Param('id') id: string, @Param('samplerId') samplerId: string) {
    return this.service.assignMission(id, samplerId);
  }

  @Patch(':id/start')
  start(@Param('id') id: string) {
    return this.service.startMission(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: MissionStatus) {
    return this.service.updateStatus(id, status);
  }
}
