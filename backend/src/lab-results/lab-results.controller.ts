import { Controller, Get, Post, Body, Param, Patch, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LabResultsService } from './lab-results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@Controller('results')
export class LabResultsController {
  constructor(private readonly labResultsService: LabResultsService) {}

  @Post()
  create(@Body() dto: CreateResultDto) {
    return this.labResultsService.create(dto);
  }

  @Get()
  findAll() {
    return this.labResultsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labResultsService.findOne(id);
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.labResultsService.uploadFile(id, file);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateResultDto) {
    return this.labResultsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labResultsService.remove(id);
  }

  @Delete(':id/file')
  removeFile(@Param('id') id: string) {
    return this.labResultsService.removeFile(id);
  }
}
