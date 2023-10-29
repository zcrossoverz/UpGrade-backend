import { UpdateUserDto } from 'src/domain/dto/updateUserDto';
import { ILogger } from 'src/domain/logger/logger.interface';
import { IUserRepository } from 'src/domain/repositories/userRepository.interface';

export class UpdateUserUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    this.logger.log('update', JSON.stringify(updateUserDto));
    const result = await this.userRepository.update(id, updateUserDto);
    this.logger.log(
      'UpdateUserUseCases execute',
      `User ${id} update with status: ${result}`,
    );
    return result;
  }
}
