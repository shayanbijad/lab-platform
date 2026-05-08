import { IsString } from 'class-validator';

export class AssignMissionDto {
  @IsString()
  samplerId: string;
}
