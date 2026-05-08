import { Module } from '@nestjs/common';
import { SamplersController } from './samplers.controller';
import { SamplersService } from './samplers.service';

@Module({
  controllers: [SamplersController],
  providers: [SamplersService],
})
export class SamplersModule {}
