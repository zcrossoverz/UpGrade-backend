import { ILogger } from 'src/domain/logger/logger.interface';
import { ITopicRepository } from 'src/domain/repositories/topicRepository.interface';

export class GetTopicUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly topicRepository: ITopicRepository,
  ) {}

  async excute(topic_id: number, user_id: number) {
    const result = this.topicRepository.getTopic(topic_id, user_id);
    return result;
  }
}
