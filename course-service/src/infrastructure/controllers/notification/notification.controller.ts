import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  UseCaseProxy,
  UsecasesProxyModule,
} from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { GetUnreadNotiListUseCases } from 'src/usecases/notification/getListUnread';
import { MarkReadNotiUseCases } from 'src/usecases/notification/markRead';

import { NOTIFICATION_MESSAGE_PATTERNS } from './messagePattern';

@Controller()
export class NotificationController {
  constructor(
    @Inject(UsecasesProxyModule.GET_LIST_UNREAD_NOTIFICATIONS_USECASES_PROXY)
    private readonly getListUnread: UseCaseProxy<GetUnreadNotiListUseCases>,
    @Inject(UsecasesProxyModule.MARK_READ_NOTIFICATIONS_USECASES_PROXY)
    private readonly markRead: UseCaseProxy<MarkReadNotiUseCases>,
  ) {}

  @MessagePattern(NOTIFICATION_MESSAGE_PATTERNS.getListUnread)
  async getUnread(
    @Payload()
    payload: {
      user_id: number;
    },
  ) {
    const { user_id } = payload;

    const result = await this.getListUnread.getInstance().excute(user_id);
    return result;
  }

  @MessagePattern(NOTIFICATION_MESSAGE_PATTERNS.markRead)
  async Markread(
    @Payload()
    payload: {
      id?: number;
      user_id: number;
    },
  ) {
    const { id, user_id } = payload;
    const result = await this.markRead.getInstance().excute(user_id, id);
    return result;
  }
}
