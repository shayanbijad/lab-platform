import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { StorageModule } from '../storage/storage.module'

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
