import { Module } from '@nestjs/common';
import { DoctorProfilesService } from './doctor-profiles.service';
import { DoctorProfilesController } from './doctor-profiles.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DoctorProfilesController],
  providers: [DoctorProfilesService, PrismaService],
  exports: [DoctorProfilesService],
})
export class DoctorProfilesModule {}
