import { UserM } from 'src/domain/model/user';
import { IUserRepository } from 'src/domain/repositories/userRepository.interface';

export class GetUserUseCases {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(id: number): Promise<UserM> {
    return await this.userRepository.findById(id);
  }
}
