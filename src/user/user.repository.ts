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
    password: string,
  ): Promise<User> {
    const user = this.create({ username, email, password });
    return this.save(user);
  }

  async updateUser(
    id: number,
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    await this.update(id, { username, email, password });
    return this.findOne({ where: { id } });
  }

  async deleteUser(id: number): Promise<void> {
    await this.delete(id);
  }
}
