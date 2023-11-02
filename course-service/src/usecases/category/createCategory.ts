import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { CategoryM } from 'src/domain/model/category';
import { ICategoryRepository } from 'src/domain/repositories/categoryRepository.interface';

export class CreateCategoryUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async excute(name: string, description: string): Promise<CategoryM> {
    if (!name || !description)
      throw new RpcException(
        new BadRequestException('Name and description are required'),
      );
    const category = await this.categoryRepository.create(name, description);
    return category;
  }
}
