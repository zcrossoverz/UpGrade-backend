import { UpdateUserDto } from '../dto/updateUserDto';
import { UserM } from '../model/user';

export interface IUserRepository {
  create(user: UserM): Promise<UserM>;
  findAll(): Promise<UserM[]>;
  findById(id: number): Promise<UserM>;
  update(id: number, user: UpdateUserDto): Promise<boolean>;
  delete(id: number): Promise<void>;
}
