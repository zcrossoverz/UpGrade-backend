import { UserM } from '../model/user';

export interface IUserRepository {
  create(user: UserM): Promise<UserM>;
  findAll(): Promise<UserM[]>;
  findById(id: number): Promise<UserM>;
  findByEmail(email: string): Promise<UserM>;
  update(id: number, user: UserM): Promise<boolean>;
  delete(id: number): Promise<void>;
}
