import { ILogger } from 'src/domain/logger/logger.interface';
import { typeStatusTopic } from 'src/domain/model/topic';
import { ITopicRepository } from 'src/domain/repositories/topicRepository.interface';

export class UpdateTopicUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly topicRepository: ITopicRepository,
  ) {}

  async excute(
    topic_id: number,
    title: string,
    description: string,
    status: typeStatusTopic,
  ) {
    const result = this.topicRepository.update(
      topic_id,
      title,
      description,
      status,
    );
    return result;
  }
}
