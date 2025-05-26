import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { Account } from '../accounts/entities/account.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,

    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) { }

  async create(
    type: TransactionType,
    amount: number,
    accountOriginId?: string,
    accountDestinationId?: string,
    description?: string,
  ): Promise<Transaction> {
    let accountOrigin: Account | null = null;
    let accountDestination: Account | null = null;

    if (type === 'DEBITO' || type === 'TRANSFERENCIA') {
      if (!accountOriginId) throw new BadRequestException('accountOriginId is required');
      accountOrigin = await this.accountsRepository.findOne({ where: { id: accountOriginId } });
      if (!accountOrigin) throw new BadRequestException('accountOrigin not found');
      if (amount <= 0) throw new BadRequestException('amount should be greater than 0');
      if (accountOrigin.balance < amount) {
        throw new BadRequestException('accountOrigin.balance should be greater than or equal to amount');
      }
      accountOrigin.balance -= amount;
      await this.accountsRepository.save(accountOrigin);
    }

    if (type === 'CREDITO' || type === 'TRANSFERENCIA') {
      if (!accountDestinationId) throw new BadRequestException('accountDestinationId is required');
      accountDestination = await this.accountsRepository.findOne({ where: { id: accountDestinationId } });
      if (!accountDestination) throw new BadRequestException('accountDestination not found');
      if (amount <= 0) throw new BadRequestException('amount should be greater than 0');
      accountDestination.balance += amount;
      await this.accountsRepository.save(accountDestination);
    }

    const transaction = this.transactionsRepository.create({
      type,
      amount,
      description,
      accountOrigin,
      accountDestination,
    } as Transaction);

    return this.transactionsRepository.save(transaction);
  }

  async findAllByUser(
    userId: string,
    accountId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Transaction[]> {
    const qb = this.transactionsRepository.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.accountOrigin', 'accountOrigin')
      .leftJoinAndSelect('transaction.accountDestination', 'accountDestination')
      .leftJoin('accountOrigin.user', 'userOrigin')
      .leftJoin('accountDestination.user', 'userDest');

    qb.where('(userOrigin.id = :userId OR userDest.id = :userId)', { userId });

    if (accountId) {
      qb.andWhere('(accountOrigin.id = :accountId OR accountDestination.id = :accountId)', { accountId });
    }

    if (startDate) qb.andWhere('transaction.date >= :startDate', { startDate });
    if (endDate) qb.andWhere('transaction.date <= :endDate', { endDate });

    qb.orderBy('transaction.date', 'DESC');

    return qb.getMany();
  }
}