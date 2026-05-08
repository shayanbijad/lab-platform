import { Module } from '@nestjs/common';
import { LabsService } from './labs.service';
import { LabsController } from './labs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LabsService],
  controllers: [LabsController],
  exports: [LabsService],
})
export class LabsModule {}
