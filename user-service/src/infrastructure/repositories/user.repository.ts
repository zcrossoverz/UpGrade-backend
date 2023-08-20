import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserM } from 'src/domain/model/user';
import { IUserRepository } from 'src/domain/repositories/userRepository.interface';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class DatabaseUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) {}

  async create(user: UserM): Promise<UserM> {
    const userNew = new User();
    userNew.email = user.email;
    userNew.username = user.username;
    userNew.password = user.password;
    const result = await this.userEntityRepository.save(userNew);
    return result;
  }
  async findAll(): Promise<UserM[]> {
    const result = await this.userEntityRepository.find();
    return result;
  }
  async findById(id: number): Promise<UserM> {
    const result = await this.userEntityRepository.findOneBy({
      id,
    });
    return result;
  }
  async update(id: number, user: UserM): Promise<boolean> {
    const result = await this.userEntityRepository.update(user, {
      id,
    });
    return result.affected == 1;
  }
  async delete(id: number): Promise<void> {
    await this.userEntityRepository.softDelete({ id });
  }
}
