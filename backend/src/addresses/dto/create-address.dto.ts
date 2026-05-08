import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  patientId: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsString()
  city: string;

  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  building?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}
