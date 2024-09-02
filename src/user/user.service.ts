import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { EncryptionService } from './encryption.service';
import { CustomLoggerService } from 'src/common/logger/custom-logger.service';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Injectable()
export class UserService {
  private readonly logger = CustomLoggerService.getLogger('RequestLogger');

  constructor(
    @InjectMetric('user_created_total')
    private readonly userCreatedCounter: Counter,
    @InjectMetric('user_find_all_total')
    private readonly userFindAllCounter: Counter,
    @InjectMetric('user_find_one_total')
    private readonly userFindOneCounter: Counter,
    @InjectMetric('user_update_total')
    private readonly userUpdateCounter: Counter,
    @InjectMetric('user_remove_total')
    private readonly userRemoveCounter: Counter,
    @InjectMetric('user_find_by_email_total')
    private readonly userFindByEmailCounter: Counter,
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    this.userFindAllCounter.inc();
    const users = await this.userRepository.find();

    return users.map((user) => {
      const { id, username, email } = user;
      return { id, username, email };
    });
  }

  async findOne(id: number): Promise<UserResponseDto> {
    this.userFindOneCounter.inc();

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      this.logger.error('User not found');
      throw new Error('User not found');
    }

    const { username, email } = user;
    return { id: user.id, username, email };
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await this.encryptionService.hashPassword(
      createUserDto.password,
    );

    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    this.userCreatedCounter.inc();

    const { id, username, email } = savedUser;
    return { id, username, email };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    this.userUpdateCounter.inc();

    const { username, email } = updateUserDto;
    return this.userRepository.updateUser(id, username, email);
  }

  async remove(id: number): Promise<void> {
    this.userRemoveCounter.inc();

    await this.userRepository.deleteUser(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    this.userFindByEmailCounter.inc();

    return this.userRepository.findByEmail(email);
  }
}
