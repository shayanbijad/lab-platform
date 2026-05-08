import { Module } from '@nestjs/common';
import { LabResultsController } from './lab-results.controller';
import { LabResultsService } from './lab-results.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [LabResultsController],
  providers: [LabResultsService]
})
export class LabResultsModule {}
