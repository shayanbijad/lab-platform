import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  addressId?: string;

  @IsArray()
  testIds: string[];

  @IsArray()
  @IsOptional()
  tests?: string[]; // For backward compatibility

  @IsOptional()
  wizardData?: any;
}
