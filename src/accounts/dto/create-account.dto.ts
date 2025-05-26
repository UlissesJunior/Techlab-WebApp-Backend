import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';
import { AccountType } from '../entities/account.entity';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  type: AccountType;

  @IsOptional()
  @IsNumber()
  balance?: number;
}