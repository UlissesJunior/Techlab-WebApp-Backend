import { Controller, Post, Get, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post()
  async create(@Body() dto: CreateAccountDto, @Req() req: Request & { user: User }) {
    console.log('Req user:', req.user);
    console.log('DTO:', dto);
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
    const user = req.user;
    return this.accountService.update(id, user, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request & { user: User }) {
    const user = req.user;
    return this.accountService.delete(id, user);
  }
}