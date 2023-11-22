import { UserM } from 'src/domain/model/user';
import { IUserRepository } from 'src/domain/repositories/userRepository.interface';
import { IfilterSearch } from 'src/domain/common/filter';

export class GetUsersUseCases {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(
    filter: IfilterSearch,
  ): Promise<{ datas: UserM[]; count: number }> {
    return await this.userRepository.findAll(filter);
  }
}
