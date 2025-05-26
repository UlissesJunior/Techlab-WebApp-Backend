import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UserService } from '../../users/user.service';
import { LoginUserDto } from '../../users/dto/login-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser = {
    id: 'user-id',
    email: 'user@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should validate user and return access token', async () => {
      const loginDto: LoginUserDto = { email: 'user@example.com', password: 'password' };

      (authService.validateUser as jest.Mock).mockResolvedValue(mockUser);
      (authService.login as jest.Mock).mockResolvedValue({ accessToken: 'mockToken' });

      const result = await controller.login(loginDto);

      expect(authService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ accessToken: 'mockToken' });
    });
  });
});