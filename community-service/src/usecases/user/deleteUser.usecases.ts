import { IUserRepository } from 'src/domain/repositories/userRepository.interface';
import { ILogger } from '../../domain/logger/logger.interface';

export class DeleteUserUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: number): Promise<void> {
    await this.userRepository.delete(id);
    this.logger.log(
      'DeleteUserUseCases execute',
      `User ${id} have been deleted`,
    );
  }
}
