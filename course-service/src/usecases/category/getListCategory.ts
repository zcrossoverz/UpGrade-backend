import { ILogger } from 'src/domain/logger/logger.interface';
import { CategoryM } from 'src/domain/model/category';
import { ICategoryRepository } from 'src/domain/repositories/categoryRepository.interface';

export class GetListCategoryUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async excute(): Promise<{ datas: CategoryM[]; count: number }> {
    this.logger.log('cds', 'GetListCategoryUseCases');
    const result = await this.categoryRepository.getList();
    return result;
  }
}
