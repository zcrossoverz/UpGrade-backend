import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATION_MESSAGE_PATTERNS } from './messagePattern';

@Injectable()
export class NotificationService {
  constructor(@Inject('NOTI_SERVICE') private readonly client: ClientProxy) {}

  async getListUnread(user_id: number) {
    console.log('send request ', user_id);
    return this.client.send(NOTIFICATION_MESSAGE_PATTERNS.getListUnread, {
      user_id,
    });
  }

  async markRead(user_id: number, id?: number) {
    return this.client.send(NOTIFICATION_MESSAGE_PATTERNS.markRead, {
      id,
      user_id,
    });
  }
}
