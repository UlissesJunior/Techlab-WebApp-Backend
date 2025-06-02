import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, AccountType } from './entities/account.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) { }

  async create(name: string, type: AccountType, user: User, balance = 0): Promise<Account> {
    const account = this.accountsRepository.create({ name, type, balance, user });
    return this.accountsRepository.save(account);
  }

  async findAllByUser(user: User): Promise<Account[]> {
    return this.accountsRepository.find({ where: { user } });
  }

  async update(accountId: string, user: User, data: Partial<Account>): Promise<Account> {
    const account = await this.accountsRepository.findOne({ where: { id: accountId }, relations: ['user'] });
    if (!account) throw new NotFoundException('Conta não encontrada');
    if (account.user.id !== user.id) throw new ForbiddenException('Acesso negado');

    Object.assign(account, data);
    return this.accountsRepository.save(account);
  }

  async delete(accountId: string, user: User): Promise<void> {
    const account = await this.accountsRepository.findOne({ where: { id: accountId }, relations: ['user'] });
    if (!account) throw new NotFoundException('Conta não encontrada');
    if (account.user.id !== user.id) throw new ForbiddenException('Acesso negado');

    await this.accountsRepository.remove(account);
  }
}