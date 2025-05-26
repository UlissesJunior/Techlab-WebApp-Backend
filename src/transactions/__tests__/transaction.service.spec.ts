import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../transaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepo: Repository<Transaction>;
  let accountRepo: Repository<Account>;

  const mockOrigin = { id: 'acc1', balance: 5000 } as Account;
  const mockDestination = { id: 'acc2', balance: 3000 } as Account;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              leftJoin: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
            }),
          },
        },
        {
          provide: getRepositoryToken(Account),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepo = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
    accountRepo = module.get<Repository<Account>>(getRepositoryToken(Account));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should process DEBITO transaction', async () => {
      (accountRepo.findOne as jest.Mock).mockResolvedValue(mockOrigin);
      (transactionRepo.create as jest.Mock).mockReturnValue({} as Transaction);
      (transactionRepo.save as jest.Mock).mockResolvedValue({ id: 'tx1' });

      const result = await service.create('DEBITO', 1000, 'acc1');

      expect(accountRepo.findOne).toHaveBeenCalledWith({ where: { id: 'acc1' } });
      expect(accountRepo.save).toHaveBeenCalledWith({ ...mockOrigin, balance: 4000 });
      expect(result).toEqual({ id: 'tx1' });
    });

    it('should throw if balance is insufficient', async () => {
      (accountRepo.findOne as jest.Mock).mockResolvedValue({ id: 'acc1', balance: 500 } as Account);

      await expect(service.create('DEBITO', 1000, 'acc1')).rejects.toThrow(BadRequestException);
    });

    it('should process CREDITO transaction', async () => {
      (accountRepo.findOne as jest.Mock).mockResolvedValue(mockDestination);
      (transactionRepo.create as jest.Mock).mockReturnValue({} as Transaction);
      (transactionRepo.save as jest.Mock).mockResolvedValue({ id: 'tx2' });

      const result = await service.create('CREDITO', 500, undefined, 'acc2');

      expect(accountRepo.findOne).toHaveBeenCalledWith({ where: { id: 'acc2' } });
      expect(accountRepo.save).toHaveBeenCalledWith({ ...mockDestination, balance: 3500 });
      expect(result).toEqual({ id: 'tx2' });
    });

    it('should process TRANSFERENCIA transaction', async () => {
      const localOrigin = { id: 'acc1', balance: 5000 } as Account;
      const localDestination = { id: 'acc2', balance: 3000 } as Account;

      (accountRepo.findOne as jest.Mock).mockImplementation(({ where }) => {
        if (where.id === 'acc1') return { ...localOrigin };
        if (where.id === 'acc2') return { ...localDestination };
      });

      (transactionRepo.create as jest.Mock).mockReturnValue({} as Transaction);
      (transactionRepo.save as jest.Mock).mockResolvedValue({ id: 'tx3' });

      const result = await service.create('TRANSFERENCIA', 1000, 'acc1', 'acc2');

      expect(accountRepo.save).toHaveBeenNthCalledWith(1, expect.objectContaining({
        id: 'acc1',
        balance: 4000,
      }));

      expect(accountRepo.save).toHaveBeenNthCalledWith(2, expect.objectContaining({
        id: 'acc2',
        balance: 4000,
      }));

      expect(result).toEqual({ id: 'tx3' });
    });
  });

  describe('findAllByUser', () => {
    it('should return transactions for user', async () => {
      const qb = transactionRepo.createQueryBuilder();
      const result = await service.findAllByUser('user-id');

      expect(qb.where).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});