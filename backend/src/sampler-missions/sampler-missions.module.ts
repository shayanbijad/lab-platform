import { Module } from '@nestjs/common';
import { SamplerMissionsController } from './sampler-missions.controller';
import { SamplerMissionsService } from './sampler-missions.service';

@Module({
  controllers: [SamplerMissionsController],
  providers: [SamplerMissionsService]
})
export class SamplerMissionsModule {}
