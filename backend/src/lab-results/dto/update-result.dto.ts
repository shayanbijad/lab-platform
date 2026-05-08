import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateResultDto {
  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsBoolean()
  reviewed?: boolean;
}
