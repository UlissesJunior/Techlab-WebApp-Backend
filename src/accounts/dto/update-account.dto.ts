import { IsOptional, IsEnum, IsNumber, IsString } from 'class-validator';
import { AccountType } from '../entities/account.entity';

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: AccountType;

  @IsOptional()
  @IsNumber()
  balance?: number;
}
