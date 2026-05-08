import { Controller, Get, Post, Param, Body } from '@nestjs/common'
import { DoctorsService } from './doctors.service'
import { Patch } from '@nestjs/common'


interface CreateDoctorDto {
  name: string
  Categories: string
  Experience: number
  Address: string
  image: string
}

@Controller('doctors')
export class DoctorsController {

  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  findAll() {
    return this.doctorsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(Number(id))
  }

  @Post()
  create(@Body() dto: CreateDoctorDto) {
    return this.doctorsService.create({
      ...dto,
      image: dto.image || '', // Provide empty string if not provided
    })
  }
@Patch(':id')
update(@Param('id') id: string, @Body() dto: CreateDoctorDto) {
  return this.doctorsService.update(Number(id), dto)
}

}
