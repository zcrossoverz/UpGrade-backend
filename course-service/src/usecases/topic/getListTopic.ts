import { ILogger } from 'src/domain/logger/logger.interface';
import { ITopicRepository } from 'src/domain/repositories/topicRepository.interface';

export class GetListTopicUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly topicRepository: ITopicRepository,
  ) {}

  async excute(unit_id: number) {
    const result = this.topicRepository.getListTopic(unit_id);
    return result;
  }
}
