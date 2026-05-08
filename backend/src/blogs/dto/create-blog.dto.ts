import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BlogStatus } from '@prisma/client';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;
}
