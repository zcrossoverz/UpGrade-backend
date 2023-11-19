import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { IfilterSearch } from 'src/domain/constant/constant';
import { INotificationRepository } from 'src/domain/repositories/notificationRepository.interface';
import { NotificationM } from 'src/domain/model/notification';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly repository: Repository<Notification>,
  ) {}

  async updateMulti(where: any, data: any): Promise<boolean> {
    const result = await this.repository
      .createQueryBuilder()
      .update()
      .set(data)
      .where(where)
      .execute();

    return result.affected > 0;
  }
  async create(
    user_id: number,
    text: string,
    href: string,
  ): Promise<NotificationM> {
    if (!user_id || !text || !href) {
      throw new RpcException(
        new BadRequestException('user id, text, href is required'),
      );
    }
    const result = await this.repository.save(
      this.repository.create({
        user_id,
        text,
        href,
        isRead: false,
      }),
    );

    return result;
  }

  async update(id: number, data: any): Promise<boolean> {
    if (!id) {
      throw new RpcException(new BadRequestException('id is required'));
    }
    const result = await this.repository.update(id, { ...data });
    return result.affected > 0;
  }
  async delete(id: number): Promise<boolean> {
    if (!id) {
      throw new RpcException(new BadRequestException('id is required'));
    }
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
  async getList(
    filter: IfilterSearch,
  ): Promise<{ datas: NotificationM[]; count: number }> {
    const { limit = 5, page = 1, order, query, exclude, explicit } = filter;

    const offset = (page - 1) * limit;

    const where: Record<string, any> = {};
    if (query) {
      query.forEach(({ key, value }) => {
        where[key] = ILike(`%${value}%`);
      });
    }

    if (exclude) {
      exclude.forEach(({ key, value }) => {
        where[key] = Not(value);
      });
    }

    if (explicit) {
      explicit.forEach(({ key, value }) => {
        where[key] = value;
      });
    }

    const [datas, count] = await this.repository.findAndCount({
      where,
      ...(order ? { order: { [order.key]: order.value } } : {}),
      take: limit,
      skip: offset,
    });

    return {
      datas,
      count,
    };
  }
  async get(id: number): Promise<NotificationM> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
    });
    return result;
  }
}
