import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from '../account.controller';
import { AccountService } from '../account.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { User } from '../../users/entities/user.entity';
import { Account } from '../entities/account.entity';

describe('AccountController', () => {
  let controller: AccountController;
  let service: AccountService;

  const mockUser: User = { id: 'user-id', name: 'Ulisses', email: 'ulisses@example.com', passwordHash: 'hashed', accounts: [] };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: {
            create: jest.fn(),
            findAllByUser: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct data', async () => {
      const dto: CreateAccountDto = { name: 'nubank', type: 'CORRENTE', balance: 10000 };
      const req = { user: mockUser };

      const account = { id: 'acc1', ...dto, user: mockUser } as Account;

      (service.create as jest.Mock).mockResolvedValue(account);

      const result = await controller.create(dto, req as any);

      expect(service.create).toHaveBeenCalledWith(dto.name, dto.type, req.user, dto.balance);
      expect(result).toEqual(account);
    });
  });

  describe('findAll', () => {
    it('should return user accounts', async () => {
      const accounts = [{ id: 'acc1' }, { id: 'acc2' }] as Account[];
      (service.findAllByUser as jest.Mock).mockResolvedValue(accounts);

      const req = { user: mockUser };

      const result = await controller.findAll(req as any);

      expect(service.findAllByUser).toHaveBeenCalledWith(req.user);
      expect(result).toEqual(accounts);
    });
  });

  describe('update', () => {
    it('should call service.update with correct data', async () => {
      const dto: UpdateAccountDto = { name: 'updated' };
      const req = { user: mockUser };

      const account = { id: 'acc1', name: 'updated' } as Account;

      (service.update as jest.Mock).mockResolvedValue(account);

      const result = await controller.update('acc1', dto, req as any);

      expect(service.update).toHaveBeenCalledWith('acc1', req.user, dto);
      expect(result).toEqual(account);
    });
  });

  describe('remove', () => {
    it('should call service.delete with correct id and user', async () => {
      const req = { user: mockUser };

      await controller.remove('acc1', req as any);

      expect(service.delete).toHaveBeenCalledWith('acc1', req.user);
    });
  });
});