import { ILogger } from 'src/domain/logger/logger.interface';
import { INotificationRepository } from 'src/domain/repositories/notificationRepository.interface';

export class MarkReadNotiUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: INotificationRepository,
  ) {}

  async excute(user_id: number, id?: number): Promise<boolean> {
    if (!id) {
      const result = await this.repository.updateMulti(
        { isRead: false, user_id },
        { isRead: true },
      );
      return result;
    }

    const noti = await this.repository.update(id, { isRead: true });
    return noti;
  }
}
