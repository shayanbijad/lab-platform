import { Controller, Post, Body, Param, Get, Patch, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrderStatus } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /orders
  @Post()
  create(@Body() dto: CreateOrderDto) {
    // Support both testIds and tests for backward compatibility
    const testIds = dto.testIds || dto.tests || [];
    
    // If userId provided (wizard flow), service will create patient and address as needed
    if (dto.userId) {
      return this.ordersService.createOrderFromWizard(
        dto.userId,
        testIds,
        dto.wizardData
      );
    }
    
    // Otherwise, expect patientId and addressId (traditional flow)
    if (!dto.patientId || !dto.addressId) {
      throw new Error('Either userId or both patientId and addressId must be provided');
    }
    
    return this.ordersService.createOrder(
      dto.patientId,
      dto.addressId,
      testIds,
    );
  }

  // GET /orders/:id
  @Get(':id')
  findOne(@Param('id') orderId: string) {
    return this.ordersService.findOne(orderId);
  }

  @Post('prescription/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadPrescription(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.ordersService.uploadPrescription(file);
  }

  // GET /orders
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // PATCH /orders/:id/status
  @Patch(':id/status')
  updateStatus(
    @Param('id') orderId: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(orderId, status);
  }

  // NEW: GET /orders/by-patient/:patientId
  @Get('by-patient/:patientId')
  getOrdersByPatient(@Param('patientId') patientId: string) {
    return this.ordersService.findOrdersByPatientId(patientId);
  }
}
