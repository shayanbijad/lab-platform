import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Global()
@Module({
  providers: [PrismaService],
  // Add PrismaModule to exports here
  exports: [PrismaService, PrismaModule],
})
export class PrismaModule {}
