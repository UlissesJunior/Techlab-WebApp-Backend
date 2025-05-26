import { Controller, Post, Get, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { AccountValidationUtils } from './utils/account-validation.utils';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountController {
  private readonly accountValidationUtils = AccountValidationUtils;
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() dto: CreateAccountDto, @Req() req: Request & { user: User }) {
    this.accountValidationUtils.validateAccountType({ type: dto.type });
    const validationError = this.accountValidationUtils.validateAccountType({ type: dto.type });
    if (validationError) {
      throw validationError;
    }
    const user = req.user;
    return this.accountService.create(dto.name, dto.type, user, dto.balance ?? 0);
  }

  @Get()
  async findAll(@Req() req: Request & { user: User }) {
    const user = req.user;
    return this.accountService.findAllByUser(user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAccountDto,
    @Req() req: Request & { user: User },
  ) {
    if(dto.type) {
      this.accountValidationUtils.validateAccountType({ type: dto.type });
      const validationError = this.accountValidationUtils.validateAccountType({ type: dto.type });
      if (validationError) {
        throw validationError;
      }
    }
    const user = req.user;
    return this.accountService.update(id, user, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request & { user: User }) {
    const user = req.user;
    return this.accountService.delete(id, user);
  }
}