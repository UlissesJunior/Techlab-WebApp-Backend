import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash password and create user', async () => {
      const name = 'John Doe';
      const email = 'john@example.com';
      const password = 'password123';
      const passwordHash = 'hashed_password';

      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(passwordHash);

      const user = { id: '1', name, email, passwordHash } as User;

      (userRepository.create as jest.Mock).mockReturnValue(user);
      (userRepository.save as jest.Mock).mockResolvedValue(user);

      const result = await service.create(name, email, password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({ name, email, passwordHash });
      expect(userRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email = 'john@example.com';
      const user = { id: '1', name: 'John', email } as User;

      (userRepository.findOne as jest.Mock).mockResolvedValue(user);

      const result = await service.findByEmail(email);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(user);
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const id = '1';
      const user = { id, name: 'John', email: 'john@example.com' } as User;

      (userRepository.findOne as jest.Mock).mockResolvedValue(user);

      const result = await service.findById(id);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(user);
    });
  });
});