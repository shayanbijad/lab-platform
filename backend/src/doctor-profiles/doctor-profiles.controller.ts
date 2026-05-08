import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { DoctorProfilesService } from './doctor-profiles.service';

@Controller('doctor-profiles')
export class DoctorProfilesController {
  constructor(private readonly service: DoctorProfilesService) {}

  @Get('user/:userId')
  getByUserId(@Param('userId') userId: string) {
    return this.service.findByUserId(userId);
  }

  @Patch('user/:userId')
  update(@Param('userId') userId: string, @Body() body: any) {
    return this.service.update(userId, body);
  }
}
