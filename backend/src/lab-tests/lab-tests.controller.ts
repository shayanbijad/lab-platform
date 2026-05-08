import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common'
import { LabTestsService } from './lab-tests.service'

@Controller('lab-tests')
export class LabTestsController {
  constructor(private readonly labTestsService: LabTestsService) {}

  @Post()
  create(@Body() data: any) {
    return this.labTestsService.create(data)
  }

  @Get()
  findAll() {
    return this.labTestsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labTestsService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.labTestsService.update(id, data)
  }
}
