import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLE, UserM } from 'src/domain/model/user';
import { IUserRepository } from 'src/domain/repositories/userRepository.interface';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from 'src/domain/dto/updateUserDto';

@Injectable()
export class DatabaseUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) {}

  async create(user: UserM): Promise<UserM> {
    const userNew = new User();
    userNew.email = user.email;
    userNew.password = user.password;
    userNew.firstName = user.firstName;
    userNew.lastName = user.lastName;
    userNew.role = ROLE.USER;
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
  async update(id: number, user: UpdateUserDto): Promise<boolean> {
    const result = await this.userEntityRepository.update(id, user);
    return result.affected == 1;
  }
  async delete(id: number): Promise<void> {
    await this.userEntityRepository.softDelete({ id });
  }
}
