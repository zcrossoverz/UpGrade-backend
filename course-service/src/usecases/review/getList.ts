import { IfilterSearch } from 'src/domain/constant/constant';
import { ILogger } from 'src/domain/logger/logger.interface';
import { IReviewRepository } from 'src/domain/repositories/reviewRepository.interface';

export class GetListReviewUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IReviewRepository,
  ) {}

  async excute(data: IfilterSearch, user_id: number) {
    const result = await this.repository.getList(data);
    const indexReview = result.datas.findIndex(
      ({ reviewer_id }) => reviewer_id === user_id,
    );

    if (indexReview !== -1) {
      const [element] = result.datas.splice(indexReview, 1);
      result.datas.unshift(element);
    }

    return result;
  }
}
