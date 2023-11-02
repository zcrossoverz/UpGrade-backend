import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { ICategoryRepository } from 'src/domain/repositories/categoryRepository.interface';

export class DeleteCategoryUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async excute(id: number): Promise<boolean> {
    if (!id)
      throw new RpcException(
        new BadRequestException('id category are required'),
      );
    const result = await this.categoryRepository.delete(id);
    return result;
  }
}
