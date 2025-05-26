import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../account.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account, AccountType } from '../entities/account.entity';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('AccountService', () => {
  let service: AccountService;
  let repo: Repository<Account>;

  const mockUser: User = { id: 'user-id', name: 'Ulisses', email: 'ulisses@example.com', passwordHash: 'hashed', accounts: [] };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    repo = module.get<Repository<Account>>(getRepositoryToken(Account));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save account', async () => {
      const account = { id: 'acc1', name: 'nubank', type: 'CORRENTE', balance: 10000, user: mockUser } as Account;
      (repo.create as jest.Mock).mockReturnValue(account);
      (repo.save as jest.Mock).mockResolvedValue(account);

      const result = await service.create('nubank', 'CORRENTE', mockUser, 10000);

      expect(repo.create).toHaveBeenCalledWith({ name: 'nubank', type: 'CORRENTE', balance: 10000, user: mockUser });
      expect(repo.save).toHaveBeenCalledWith(account);
      expect(result).toEqual(account);
    });
  });

  describe('findAllByUser', () => {
    it('should return accounts for user', async () => {
      const accounts = [{ id: 'acc1' }, { id: 'acc2' }] as Account[];
      (repo.find as jest.Mock).mockResolvedValue(accounts);

      const result = await service.findAllByUser(mockUser);

      expect(repo.find).toHaveBeenCalledWith({ where: { user: mockUser } });
      expect(result).toEqual(accounts);
    });
  });

  describe('update', () => {
    it('should update account if owner', async () => {
      const account = { id: 'acc1', user: mockUser } as Account;
      (repo.findOne as jest.Mock).mockResolvedValue(account);
      (repo.save as jest.Mock).mockResolvedValue(account);

      const result = await service.update('acc1', mockUser, { name: 'updated' });

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'acc1' }, relations: ['user'] });
      expect(result).toEqual(account);
    });

    it('should throw NotFoundException if account not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.update('acc1', mockUser, {})).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      const account = { id: 'acc1', user: { id: 'other-user' } } as Account;
      (repo.findOne as jest.Mock).mockResolvedValue(account);

      await expect(service.update('acc1', mockUser, {})).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should remove account if owner', async () => {
      const account = { id: 'acc1', user: mockUser } as Account;
      (repo.findOne as jest.Mock).mockResolvedValue(account);
      (repo.remove as jest.Mock).mockResolvedValue(undefined);

      await service.delete('acc1', mockUser);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'acc1' }, relations: ['user'] });
      expect(repo.remove).toHaveBeenCalledWith(account);
    });

    it('should throw NotFoundException if account not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.delete('acc1', mockUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      const account = { id: 'acc1', user: { id: 'other-user' } } as Account;
      (repo.findOne as jest.Mock).mockResolvedValue(account);

      await expect(service.delete('acc1', mockUser)).rejects.toThrow(ForbiddenException);
    });
  });
});