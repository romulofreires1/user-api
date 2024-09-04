import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { EncryptionService } from './encryption.service';
import { CustomLoggerService } from '../common/logger/custom-logger.service';

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

const mockPrometheusCounter = {
  inc: jest.fn(),
};

const mockEncryptionService = {
  hashPassword: jest.fn().mockResolvedValue('hashed_password'),
  comparePasswords: jest.fn(),
};

const mockLoggerService = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
  getLogger: jest.fn().mockReturnValue({
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  }),
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
        { provide: CustomLoggerService, useValue: mockLoggerService },
        {
          provide: 'PROM_METRIC_USER_CREATED_TOTAL',
          useValue: mockPrometheusCounter,
        },
        {
          provide: 'PROM_METRIC_USER_FIND_ALL_TOTAL',
          useValue: mockPrometheusCounter,
        },
        {
          provide: 'PROM_METRIC_USER_FIND_ONE_TOTAL',
          useValue: mockPrometheusCounter,
        },
        {
          provide: 'PROM_METRIC_USER_UPDATE_TOTAL',
          useValue: mockPrometheusCounter,
        },
        {
          provide: 'PROM_METRIC_USER_REMOVE_TOTAL',
          useValue: mockPrometheusCounter,
        },
        {
          provide: 'PROM_METRIC_USER_FIND_BY_EMAIL_TOTAL',
          useValue: mockPrometheusCounter,
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
      id: 'a3bb189e-8bf9-4f1f-b88c-0dfc9a8f1bd5',
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
      id: 'a3bb189e-8bf9-4f1f-b88c-0dfc9a8f1bd5',
      username: 'testuser',
      email: 'test@example.com',
    });
  });

  it('should return all users without passwordHash', async () => {
    const users = [
      {
        id: 'a3bb189e-8bf9-4f1f-b88c-0dfc9a8f1bd5',
        username: 'user1',
        email: 'user1@example.com',
        passwordHash: 'hashed1',
      },
      {
        id: 'b3bb189e-8bf9-4f1f-b88c-0dfc9a8f1bd5',
        username: 'user2',
        email: 'user2@example.com',
        passwordHash: 'hashed2',
      },
    ];
    mockUserRepository.find.mockResolvedValue(users);

    const result = await userService.findAll();

    expect(result).toEqual([
      {
        id: 'a3bb189e-8bf9-4f1f-b88c-0dfc9a8f1bd5',
        username: 'user1',
        email: 'user1@example.com',
      },
      {
        id: 'b3bb189e-8bf9-4f1f-b88c-0dfc9a8f1bd5',
        username: 'user2',
        email: 'user2@example.com',
      },
    ]);
  });

  it('should return a user by ID without passwordHash', async () => {
    const user = {
      id: 'a3bb189e-8bf9-4f1f-b88c-0dfc9a8f1bd5',
      username: 'user1',
      email: 'user1@example.com',
      passwordHash: 'hashed1',
    };
    mockUserRepository.findOne.mockResolvedValue(user);

    const result = await userService.findOne(
      'a3bb189e-8bf9-4f1f-b88c-0dfc9a8f1bd5',
    );

    expect(result).toEqual({
      id: 'a3bb189e-8bf9-4f1f-b88c-0dfc9a8f1bd5',
      username: 'user1',
      email: 'user1@example.com',
    });
  });

  it('should throw an error if user is not found', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    await expect(
      userService.findOne('a3bb189e-8bf9-4f1f-b88c-0dfc9a8f1bd5'),
    ).rejects.toThrow('User not found');
  });
});
