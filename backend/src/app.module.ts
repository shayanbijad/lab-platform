import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { LabTestsModule } from './lab-tests/lab-tests.module';
import { OrdersModule } from './orders/orders.module';
import { SamplerMissionsModule } from './sampler-missions/sampler-missions.module';
import { LabResultsModule } from './lab-results/lab-results.module';
import { BlogsModule } from './blogs/blogs.module';
import { StorageModule } from './storage/storage.module';
import { AddressesModule } from './addresses/addresses.module';
import { DoctorsModule } from './doctors/doctors.module';
import { LabsModule } from './labs/labs.module';
import { SamplersModule } from './samplers/samplers.module';
import { DoctorProfilesModule } from './doctor-profiles/doctor-profiles.module';
import { DoctorCrmController } from './doctors/doctor-crm.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    PatientsModule,
    LabTestsModule,
    OrdersModule,
    SamplerMissionsModule,
    LabResultsModule,
    BlogsModule,
    StorageModule,
    AddressesModule,
    DoctorsModule,
    LabsModule,
    SamplersModule,
    DoctorProfilesModule,
  ],
  controllers: [AppController, DoctorCrmController],
  providers: [AppService],
})
export class AppModule {}
