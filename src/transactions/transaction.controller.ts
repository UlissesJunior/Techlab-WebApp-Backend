import { Controller, Post, Get, Body, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Request } from 'express';
import { AuthenticatedUser } from 'src/auth/auth.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TransactionValidationUtils } from './utils/transaction-validation.utils';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  private readonly transactionValidation = TransactionValidationUtils; 
  constructor(private readonly transactionService: TransactionService) { }

  
  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    const validationError = this.transactionValidation.validateTransactionType({ type: dto.type });
    if (validationError) {
      throw validationError;
    }
    
    return this.transactionService.create(
      dto.type,
      dto.amount,
      dto.accountOriginId,
      dto.accountDestinationId,
      dto.description
    );
  }

  @Get()
  async findAll(
    @Query('accountId') accountId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Req() req: Request & { user: AuthenticatedUser }
  ) {
    const user = req.user;

    const parsedStart = startDate ? new Date(startDate) : undefined;
    const parsedEnd = endDate ? new Date(endDate) : undefined;

    return this.transactionService.findAllByUser(user.id, accountId, parsedStart, parsedEnd);
  }
}