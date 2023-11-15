import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { REVIEW_MESSAGE_PATTERNS } from './messagePattern';
import { IfilterSearch } from 'src/common/interface/filterSearch';

@Injectable()
export class ReviewService {
  constructor(@Inject('REVIEW_SERVICE') private readonly client: ClientProxy) {}

  async create(
    user_id: number,
    course_id: number,
    user_email: string,
    user_avatar: string,
    user_fullname: string,
    rate: number,
    comment: string,
  ) {
    return this.client.send(REVIEW_MESSAGE_PATTERNS.create, {
      user_id,
      course_id,
      user_email,
      user_avatar,
      user_fullname,
      rate,
      comment,
    });
  }

  async update(id: number, rate?: number, comment?: string) {
    return this.client.send(REVIEW_MESSAGE_PATTERNS.update, {
      id,
      rate,
      comment,
    });
  }

  async deleteReview(id: number) {
    return this.client.send(REVIEW_MESSAGE_PATTERNS.delete, {
      id,
    });
  }

  async getList(filter: IfilterSearch) {
    return this.client.send(REVIEW_MESSAGE_PATTERNS.getList, {
      filter,
    });
  }
}
