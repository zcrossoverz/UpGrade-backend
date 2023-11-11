import { ILogger } from 'src/domain/logger/logger.interface';
import { ITopicRepository } from 'src/domain/repositories/topicRepository.interface';

export class GetListTopicUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly topicRepository: ITopicRepository,
  ) {}

  async excute(unit_id: number) {
    const drive_folder_unit_id =
      await this.topicRepository.getFolderDriveId(unit_id);
    const result = await this.topicRepository.getListTopic(unit_id);
    return { ...result, drive_folder_unit_id };
  }
}
