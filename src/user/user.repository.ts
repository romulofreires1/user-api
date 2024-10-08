import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ where: { email } });
  }

  async createUser(
    username: string,
    email: string,
    passwordHash: string,
  ): Promise<User> {
    const user = this.create({ username, email, passwordHash });
    return this.save(user);
  }

  async updateUser(id: string, username: string, email: string): Promise<User> {
    await this.update(id, { username, email });
    return this.findOne({ where: { id } });
  }

  async deleteUser(id: string): Promise<void> {
    await this.delete(id);
  }
}
