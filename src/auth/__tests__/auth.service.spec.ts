import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-id',
    email: 'user@example.com',
    passwordHash: 'hashedPassword',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should validate user with correct password', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser(mockUser.email, 'password');

      expect(userService.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.validateUser('wrong@example.com', 'password')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.validateUser(mockUser.email, 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const result = await service.login({ id: mockUser.id, email: mockUser.email });

      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id, email: mockUser.email });
      expect(result).toEqual({ accessToken: 'mockToken' });
    });
  });
});