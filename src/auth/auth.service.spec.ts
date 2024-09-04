import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthenticatedUser } from './auth-user.interface';

const mockUserService = {
  findByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mockJwtToken'),
};

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('deve retornar o usuário autenticado se as credenciais estiverem corretas', async () => {
      const mockUser = {
        id: 1,
        username: 'john_doe',
        email: 'john.doe@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
      };

      mockUserService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.validateUser(
        mockUser.email,
        'password123',
      );

      expect(result).toEqual({
        userId: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
      });
    });

    it('deve retornar null se o usuário não for encontrado', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      const result = await authService.validateUser(
        'unknown@example.com',
        'password123',
      );

      expect(result).toBeNull();
    });

    it('deve retornar null se a senha estiver incorreta', async () => {
      const mockUser = {
        id: 1,
        username: 'john_doe',
        email: 'john.doe@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
      };

      mockUserService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await authService.validateUser(
        mockUser.email,
        'wrongpassword',
      );

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('deve retornar um token de acesso ao usuário autenticado', async () => {
      const mockUser: AuthenticatedUser = {
        userId: 1,
        username: 'john_doe',
        email: 'john.doe@example.com',
      };

      const result = await authService.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.userId,
      });
      expect(result).toEqual({
        access_token: 'mockJwtToken',
      });
    });
  });
});
