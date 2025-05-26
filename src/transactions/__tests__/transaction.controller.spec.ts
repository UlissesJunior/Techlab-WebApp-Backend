import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../transaction.controller';
import { TransactionService } from '../transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction } from '../entities/transaction.entity';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            create: jest.fn(),
            findAllByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should validate and call service.create', async () => {
      const dto: CreateTransactionDto = { type: 'DEBITO', amount: 1000, accountOriginId: 'acc1' };

      const transaction = { id: 'tx1' } as Transaction;
      (service.create as jest.Mock).mockResolvedValue(transaction);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(
        dto.type,
        dto.amount,
        dto.accountOriginId,
        dto.accountDestinationId,
        dto.description,
      );
      expect(result).toEqual(transaction);
    });
  });

  describe('findAll', () => {
    it('should call service.findAllByUser with correct params', async () => {
      const transactions = [{ id: 'tx1' }] as Transaction[];
      (service.findAllByUser as jest.Mock).mockResolvedValue(transactions);

      const req = { user: { id: 'user-id' } };
      const result = await controller.findAll('acc1', '2024-01-01', '2024-12-31', req as any);

      expect(service.findAllByUser).toHaveBeenCalledWith('user-id', 'acc1', new Date('2024-01-01'), new Date('2024-12-31'));
      expect(result).toEqual(transactions);
    });
  });
});