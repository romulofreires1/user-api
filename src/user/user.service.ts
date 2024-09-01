import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { EncryptionService } from './encryption.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();

    return users.map((user) => {
      const { id, username, email } = user;
      return { id, username, email };
    });
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
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

    const { id, username, email } = savedUser;
    return { id, username, email };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { username, email } = updateUserDto;
    return this.userRepository.updateUser(id, username, email);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.deleteUser(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findByEmail(email);
  }
}
