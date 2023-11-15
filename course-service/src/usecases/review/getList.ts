import { IfilterSearch } from 'src/domain/constant/constant';
import { ILogger } from 'src/domain/logger/logger.interface';
import { IReviewRepository } from 'src/domain/repositories/reviewRepository.interface';

export class GetListReviewUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IReviewRepository,
  ) {}

  async excute(data: IfilterSearch) {
    const result = await this.repository.getList(data);
    return result;
  }
}
