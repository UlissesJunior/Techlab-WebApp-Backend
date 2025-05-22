import { IsNotEmpty, IsEnum, IsOptional, IsNumber, IsString } from 'class-validator';
import { AccountType } from '../entities/account.entity';

export class CreateAccountDto {
  @IsNotEmpty()
  name: string;

  @IsString()
  type: AccountType;

  @IsOptional()
  @IsNumber()
  balance?: number;
}