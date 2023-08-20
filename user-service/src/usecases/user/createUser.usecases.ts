import { ILogger } from 'src/domain/logger/logger.interface';
import { UserM } from 'src/domain/model/user';
import { IUserRepository } from 'src/domain/repositories/userRepository.interface';

export class CreateUserUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(
    username: string,
    password: string,
    email: string,
  ): Promise<UserM> {
    const user = new UserM();
    user.email = email;
    user.username = username;
    user.password = password;
    const result = await this.userRepository.create(user);

    this.logger.log('createUserUsecases execute', 'New user have been created');
    return result;
  }
}
