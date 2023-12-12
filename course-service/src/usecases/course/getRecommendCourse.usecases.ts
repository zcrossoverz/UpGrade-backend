import { ILogger } from 'src/domain/logger/logger.interface';
import { ICourseRepository } from 'src/domain/repositories/courseRepository.interface';

export class GetRecommendCourseUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly courseRepository: ICourseRepository,
  ) {}

  async excute(user_id: number): Promise<any> {
    const result = await this.courseRepository.getListRecommend(user_id);
    return result;
  }
}
