import { ILogger } from 'src/domain/logger/logger.interface';
import { UserM } from 'src/domain/model/user';
import { IUserRepository } from 'src/domain/repositories/userRepository.interface';

export class UpdateUserUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    id: number,
    firstName: string,
    lastName: string,
  ): Promise<boolean> {
    const userUpdate = new UserM();
    userUpdate.firstName = firstName;
    userUpdate.lastName = lastName;
    const result = await this.userRepository.update(id, userUpdate);
    this.logger.log(
      'UpdateUserUseCases execute',
      `User ${id} update with status: ${result}`,
    );
    return result;
  }
}
