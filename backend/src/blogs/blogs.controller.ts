import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogStatus } from '@prisma/client';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  create(@Body() dto: CreateBlogDto) {
    return this.blogsService.create(dto);
  }

  @Get()
  findAll(@Query('status') status?: BlogStatus) {
    return this.blogsService.findAll(status);
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.blogsService.findOne(idOrSlug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.blogsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }

  @Post(':id/cover')
  @UseInterceptors(FileInterceptor('file'))
  uploadCover(@Param('id') id: string, @UploadedFile() file: any) {
    return this.blogsService.uploadCover(id, file);
  }

  @Delete(':id/cover')
  removeCover(@Param('id') id: string) {
    return this.blogsService.removeCover(id);
  }

  @Post('uploads/image')
  @UseInterceptors(FileInterceptor('file'))
  uploadInlineImage(@UploadedFile() file: any) {
    return this.blogsService.uploadInlineImage(file);
  }
}
