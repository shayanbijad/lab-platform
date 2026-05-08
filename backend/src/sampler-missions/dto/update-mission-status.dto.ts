import { IsEnum } from 'class-validator';
import { MissionStatus } from '@prisma/client';

export class UpdateMissionStatusDto {
  @IsEnum(MissionStatus)
  status: MissionStatus;
}
