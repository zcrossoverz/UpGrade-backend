import { ILogger } from 'src/domain/logger/logger.interface';
import { ITopicRepository } from 'src/domain/repositories/topicRepository.interface';

export class CreateTopicUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly topicRepository: ITopicRepository,
  ) {}

  async excute(
    title: string,
    description: string,
    video_url: string,
    unit_id: number,
  ) {
    const result = this.topicRepository.create(
      title,
      description,
      video_url,
      unit_id,
    );
    return result;
  }
}
