import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  create(dto: CreateBlogDto) {
    const prepared = this.prepareCreateData(dto);
    return this.prisma.blog.create({ data: prepared });
  }

  findAll(status?: BlogStatus) {
    return this.prisma.blog.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(idOrSlug: string) {
    const byId = await this.prisma.blog.findUnique({ where: { id: idOrSlug } });
    if (byId) return byId;

    const bySlug = await this.prisma.blog.findUnique({ where: { slug: idOrSlug } });
    if (!bySlug) throw new NotFoundException('Blog not found');

    return bySlug;
  }

  update(id: string, dto: UpdateBlogDto) {
    const prepared = this.prepareUpdateData(dto);
    return this.prisma.blog.update({ where: { id }, data: prepared });
  }

  async remove(id: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');

    await this.deleteStoredFile(blog.coverImageUrl);
    return this.prisma.blog.delete({ where: { id } });
  }

  async uploadCover(id: string, file: any) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');
    if (!file) throw new NotFoundException('No file uploaded');

    await this.deleteStoredFile(blog.coverImageUrl);

    const fileName = `blogs/${id}/cover-${Date.now()}-${this.sanitizeFileName(file.originalname)}`;
    const uploaded = await this.storage.upload(fileName, file.buffer, file.mimetype);

    return this.prisma.blog.update({
      where: { id },
      data: { coverImageUrl: uploaded.url },
    });
  }

  async removeCover(id: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');

    await this.deleteStoredFile(blog.coverImageUrl);

    return this.prisma.blog.update({
      where: { id },
      data: { coverImageUrl: null },
    });
  }

  async uploadInlineImage(file: any) {
    if (!file) throw new NotFoundException('No file uploaded');

    const fileName = `blogs/editor/${Date.now()}-${this.sanitizeFileName(file.originalname)}`;
    const uploaded = await this.storage.upload(fileName, file.buffer, file.mimetype);

    return { url: uploaded.url };
  }

  private prepareCreateData(dto: CreateBlogDto): Prisma.BlogCreateInput {
    const title = dto.title.trim();
    const content = dto.content.trim();
    const excerpt = dto.excerpt?.trim();
    const slug = this.slugify(dto.slug?.trim() || title);

    return {
      title,
      content,
      slug,
      excerpt: excerpt || this.buildExcerpt(content),
      coverImageUrl: dto.coverImageUrl,
      status: dto.status,
    };
  }

  private prepareUpdateData(dto: UpdateBlogDto): Prisma.BlogUpdateInput {
    const title = dto.title?.trim();
    const content = dto.content?.trim();
    const excerpt = dto.excerpt?.trim();
    const slugSource = dto.slug?.trim() || title;

    return {
      ...(title ? { title } : {}),
      ...(content ? { content } : {}),
      ...(slugSource ? { slug: this.slugify(slugSource) } : {}),
      ...(dto.status ? { status: dto.status } : {}),
      ...(dto.coverImageUrl !== undefined ? { coverImageUrl: dto.coverImageUrl } : {}),
      ...(excerpt
        ? { excerpt }
        : content
          ? { excerpt: this.buildExcerpt(content) }
          : {}),
    };
  }

  private buildExcerpt(content: string) {
    const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!text) return null;
    return text.length > 180 ? `${text.slice(0, 177)}...` : text;
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private sanitizeFileName(fileName: string) {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, '-');
  }

  private async deleteStoredFile(url?: string | null) {
    const prefix = 'http://localhost:9000/lab-files/';
    if (!url || !url.startsWith(prefix)) return;

    const objectName = url.slice(prefix.length);
    if (objectName) {
      await this.storage.remove(objectName);
    }
  }
}
