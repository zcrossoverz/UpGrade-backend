import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  UseCaseProxy,
  UsecasesProxyModule,
} from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { COMMENT_MESSAGE_PATTERNS } from './messagePattern';
import { IfilterSearch } from 'src/domain/constant/constant';
import { CreateCommentUseCase } from 'src/usecases/comment/create';
import { UpdateCommentUseCase } from 'src/usecases/comment/update';
import { DeleteCommentUseCase } from 'src/usecases/comment/delete';
import { GetListCommentUseCase } from 'src/usecases/comment/getList';
import { ReactCommentUseCase } from 'src/usecases/comment/react';
import { enumCommentRole } from 'src/infrastructure/entities/comment.entity';

@Controller()
export class CommentController {
  constructor(
    @Inject(UsecasesProxyModule.CREATE_COMMENT_USECASES_PROXY)
    private readonly create: UseCaseProxy<CreateCommentUseCase>,
    @Inject(UsecasesProxyModule.UPDATE_COMMENT_USECASES_PROXY)
    private readonly update: UseCaseProxy<UpdateCommentUseCase>,
    @Inject(UsecasesProxyModule.DELETE_COMMENT_USECASES_PROXY)
    private readonly deleteComment: UseCaseProxy<DeleteCommentUseCase>,
    @Inject(UsecasesProxyModule.GETLIST_COMMENT_USECASES_PROXY)
    private readonly getList: UseCaseProxy<GetListCommentUseCase>,
    @Inject(UsecasesProxyModule.REACT_COMMENT_USECASES_PROXY)
    private readonly react: UseCaseProxy<ReactCommentUseCase>,
  ) {}

  @MessagePattern(COMMENT_MESSAGE_PATTERNS.create)
  async createCmt(
    @Payload()
    payload: {
      topic_id: number;
      user_id: number;
      user_avatar: string;
      user_fullname: string;
      user_email: string;
      user_role: enumCommentRole;
      text: string;
      parent_id?: number;
    },
  ) {
    const result = await this.create
      .getInstance()
      .excute(
        payload.topic_id,
        payload.user_id,
        payload.user_avatar,
        payload.user_fullname,
        payload.user_email,
        payload.user_role,
        payload.text,
        payload.parent_id,
      );
    return result;
  }

  @MessagePattern(COMMENT_MESSAGE_PATTERNS.create)
  async createComment(
    @Payload()
    payload: {
      topic_id: number;
      user_id: number;
      user_avatar: string;
      user_fullname: string;
      user_email: string;
      user_role: enumCommentRole;
      text: string;
      parent_id?: number;
    },
  ) {
    const result = await this.create
      .getInstance()
      .excute(
        payload.topic_id,
        payload.user_id,
        payload.user_avatar,
        payload.user_fullname,
        payload.user_email,
        payload.user_role,
        payload.text,
        payload.parent_id,
      );
    return result;
  }

  @MessagePattern(COMMENT_MESSAGE_PATTERNS.update)
  async updateComment(
    @Payload()
    payload: {
      id: number;
      text: string;
    },
  ) {
    const result = await this.update
      .getInstance()
      .excute(payload.id, payload.text);
    return result;
  }

  @MessagePattern(COMMENT_MESSAGE_PATTERNS.getList)
  async getListComment(
    @Payload()
    payload: {
      filter: IfilterSearch;
    },
  ) {
    const result = await this.getList.getInstance().excute(payload.filter);
    return result;
  }

  @MessagePattern(COMMENT_MESSAGE_PATTERNS.delete)
  async deleteCommentC(
    @Payload()
    payload: {
      id: number;
    },
  ) {
    const result = await this.deleteComment.getInstance().excute(payload.id);
    return result;
  }

  @MessagePattern(COMMENT_MESSAGE_PATTERNS.react)
  async reactComment(
    @Payload()
    payload: {
      id: number;
      isLike: boolean;
      user_id: number;
    },
  ) {
    const result = await this.react
      .getInstance()
      .excute(payload.id, payload.isLike, payload.user_id);
    return result;
  }
}
