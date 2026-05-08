import { IsString, IsDateString } from 'class-validator';

export class CreateMissionDto {
  @IsString()
  orderId: string;

  @IsDateString()
  scheduledAt: string;

  @IsString()
  address: string;
}
