import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(@Body() dto: CreateAddressDto) {
    return this.addressesService.create(dto);
  }

  @Get()
  findAll() {
    return this.addressesService.findAll();
  }

  @Get('patient/:patientId')
  findPatientAddresses(@Param('patientId') patientId: string) {
    return this.addressesService.findPatientAddresses(patientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.addressesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressesService.remove(id);
  }
}
