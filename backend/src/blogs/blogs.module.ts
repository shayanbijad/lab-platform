import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService, PrismaService, StorageService],
})
export class BlogsModule {}
