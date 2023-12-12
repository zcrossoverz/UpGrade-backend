import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { NotificationM } from 'src/domain/model/notification';
import { INotificationRepository } from 'src/domain/repositories/notificationRepository.interface';

export class GetUnreadNotiListUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: INotificationRepository,
  ) {}

  async excute(
    user_id: number,
  ): Promise<{ datas: NotificationM[]; count: number }> {
    if (!user_id)
      throw new RpcException(new BadRequestException('user id are required'));

    const result = await this.repository.getList({
      limit: 20,
      explicit: [
        {
          key: 'user_id',
          value: user_id,
        },
        {
          key: 'isRead',
          value: false,
        },
      ],
      order: {
        key: 'id',
        value: 'DESC',
      },
    });

    return result;
  }
}
