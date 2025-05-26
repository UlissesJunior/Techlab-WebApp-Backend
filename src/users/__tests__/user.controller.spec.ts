import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct params', async () => {
      const dto: CreateUserDto = {
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
      };

      const user: Partial<User> = { id: '1', name: dto.name, email: dto.email };

      (service.create as jest.Mock).mockResolvedValue(user);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto.name, dto.email, dto.password);
      expect(result).toEqual(user);
    });
  });
});