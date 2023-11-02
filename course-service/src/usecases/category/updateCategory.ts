import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { ICategoryRepository } from 'src/domain/repositories/categoryRepository.interface';

export class UpdateCategoryUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async excute(
    id: number,
    name: string,
    description: string,
  ): Promise<boolean> {
    if (!id) {
      throw new RpcException(
        new BadRequestException('id category are required'),
      );
    }

    if (!name && !description)
      throw new RpcException(
        new BadRequestException('Name or description are required'),
      );

    const result = await this.categoryRepository.update(id, name, description);
    return result;
  }
}
