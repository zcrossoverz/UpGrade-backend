import { IfilterSearch } from '../constant/constant';
import { NotificationM } from '../model/notification';

export interface INotificationRepository {
  create(user_id: number, text: string, href: string): Promise<NotificationM>;
  update(id: number, data: any): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  getList(
    filter: IfilterSearch,
  ): Promise<{ datas: NotificationM[]; count: number }>;
  get(id: number): Promise<NotificationM>;
}
