import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsString()
  type: TransactionType;

  @IsOptional()
  @IsUUID()
  accountOriginId?: string;

  @IsOptional()
  @IsUUID()
  accountDestinationId?: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  date?: Date;
}