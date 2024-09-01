import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;
    return this.userRepository.createUser(username, email, password);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { username, email, password } = updateUserDto;
    return this.userRepository.updateUser(id, username, email, password);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.deleteUser(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findByEmail(email);
  }
}
