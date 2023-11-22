import { ILogger } from 'src/domain/logger/logger.interface';
import { ICategoryRepository } from 'src/domain/repositories/categoryRepository.interface';

export class AnalystCategoryUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async excute() {
    const result = await this.categoryRepository.analyst();
    return result;
  }
}
