import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { EncryptionService } from './encryption.service';

// Criação de um mock de repositório para o teste
const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

const mockEncryptionService = {
  hashPassword: jest.fn().mockResolvedValue('hashed_password'), // Retorna um hash previsível
  comparePasswords: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: EncryptionService,
          useValue: mockEncryptionService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user with a hashed password', async () => {
    const createUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
    };

    const savedUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashed_password',
    };

    mockUserRepository.create.mockReturnValue(savedUser);
    mockUserRepository.save.mockResolvedValue(savedUser);

    const result = await userService.create(createUserDto);

    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...createUserDto,
      passwordHash: 'hashed_password', // Agora sabemos o hash exato
    });
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(result).toEqual({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    });
  });

  it('should return all users without passwordHash', async () => {
    const users = [
      {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        passwordHash: 'hashed1',
      },
      {
        id: 2,
        username: 'user2',
        email: 'user2@example.com',
        passwordHash: 'hashed2',
      },
    ];
    mockUserRepository.find.mockResolvedValue(users);

    const result = await userService.findAll();

    expect(result).toEqual([
      { id: 1, username: 'user1', email: 'user1@example.com' },
      { id: 2, username: 'user2', email: 'user2@example.com' },
    ]);
  });

  it('should return a user by ID without passwordHash', async () => {
    const user = {
      id: 1,
      username: 'user1',
      email: 'user1@example.com',
      passwordHash: 'hashed1',
    };
    mockUserRepository.findOne.mockResolvedValue(user);

    const result = await userService.findOne(1);

    expect(result).toEqual({
      id: 1,
      username: 'user1',
      email: 'user1@example.com',
    });
  });

  it('should throw an error if user is not found', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    await expect(userService.findOne(1)).rejects.toThrow('User not found');
  });
});
