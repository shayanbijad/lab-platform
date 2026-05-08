import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateResultDto {
  @IsString()
  orderTestId: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
