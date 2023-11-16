import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { COMMENT_MESSAGE_PATTERNS } from './messagePattern';
import { IfilterSearch } from 'src/common/interface/filterSearch';

export enum enumCommentRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

@Injectable()
export class CommentService {
  constructor(
    @Inject('COMMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async create(
    topic_id: number,
    user_id: number,
    user_avatar: string,
    user_fullname: string,
    user_email: string,
    user_role: enumCommentRole,
    text: string,
    parent_id?: number,
  ) {
    return this.client.send(COMMENT_MESSAGE_PATTERNS.create, {
      user_id,
      topic_id,
      user_avatar,
      user_email,
      user_fullname,
      user_role,
      text,
      parent_id,
    });
  }

  async getList(filter: IfilterSearch) {
    return this.client.send(COMMENT_MESSAGE_PATTERNS.getList, {
      filter,
    });
  }

  async delete(id: number) {
    return this.client.send(COMMENT_MESSAGE_PATTERNS.delete, {
      id,
    });
  }

  async update(id: number, text: string) {
    return this.client.send(COMMENT_MESSAGE_PATTERNS.update, {
      id,
      text,
    });
  }

  async react(id: number, isLike: boolean, user_id: number) {
    return this.client.send(COMMENT_MESSAGE_PATTERNS.react, {
      id,
      isLike,
      user_id,
    });
  }
}
