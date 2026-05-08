import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common'
import { PatientsService } from './patients.service'
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto'

@Controller('patients')
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Get()
  findAll() {
    return this.patientsService.findAll()
  }

  @Post()
  create(@Body() body: any) {
    const userId = body.userId   // temporary for MVP
    return this.patientsService.create(userId, body)
  }

  @Patch('user/:userId')
  upsertProfileByUserId(
    @Param('userId') userId: string,
    @Body() body: UpdatePatientProfileDto,
  ) {
    return this.patientsService.upsertProfileByUserId(userId, body)
  }

  @Get('user/:userId')
  getPatientByUserId(@Param('userId') userId: string) {
    return this.patientsService.getPatientByUserId(userId)
  }

  // GET /patients/:id - Get patient by ID
  @Get(':id')
  getPatientById(@Param('id') patientId: string) {
    return this.patientsService.getPatientById(patientId)
  }
}
