import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  UseCaseProxy,
  UsecasesProxyModule,
} from 'src/infrastructure/usecases-proxy/usecases-proxy.module';

import { REVIEW_MESSAGE_PATTERNS } from './messagePattern';
import { CreateReviewUseCase } from 'src/usecases/review/create';
import { UpdateReviewUseCase } from 'src/usecases/review/update';
import { DeleteReviewUseCase } from 'src/usecases/review/delete';
import { IfilterSearch } from 'src/domain/constant/constant';
import { GetListReviewUseCase } from 'src/usecases/review/getList';

@Controller()
export class ReviewController {
  constructor(
    @Inject(UsecasesProxyModule.CREATE_REVIEW_USECASES_PROXY)
    private readonly create: UseCaseProxy<CreateReviewUseCase>,
    @Inject(UsecasesProxyModule.UPDATE_REVIEW_USECASES_PROXY)
    private readonly update: UseCaseProxy<UpdateReviewUseCase>,
    @Inject(UsecasesProxyModule.DELETE_REVIEW_USECASES_PROXY)
    private readonly deleteClient: UseCaseProxy<DeleteReviewUseCase>,
    @Inject(UsecasesProxyModule.GETLIST_REVIEW_USECASES_PROXY)
    private readonly getList: UseCaseProxy<GetListReviewUseCase>,
  ) {}

  @MessagePattern(REVIEW_MESSAGE_PATTERNS.create)
  async createReview(
    @Payload()
    payload: {
      course_id: number;
      user_id: number;
      user_email: string;
      user_fullname: string;
      user_avatar: string;
      rate: number;
      comment: string;
    },
  ) {
    const {
      user_id,
      comment,
      course_id,
      rate,
      user_avatar,
      user_fullname,
      user_email,
    } = payload;

    const result = await this.create
      .getInstance()
      .excute(
        course_id,
        user_id,
        user_email,
        user_fullname,
        user_avatar,
        rate,
        comment,
      );
    return result;
  }

  @MessagePattern(REVIEW_MESSAGE_PATTERNS.update)
  async updateReview(
    @Payload()
    payload: {
      id: number;
      rate?: number;
      comment?: string;
    },
  ) {
    const { id, comment, rate } = payload;

    const result = await this.update.getInstance().excute(id, rate, comment);
    return result;
  }

  @MessagePattern(REVIEW_MESSAGE_PATTERNS.delete)
  async deleteReview(
    @Payload()
    payload: {
      id: number;
    },
  ) {
    const { id } = payload;

    const result = await this.deleteClient.getInstance().excute(id);
    return result;
  }

  @MessagePattern(REVIEW_MESSAGE_PATTERNS.getList)
  async getListRw(
    @Payload()
    payload: {
      filter: IfilterSearch;
      user_id: number;
    },
  ) {
    const { filter, user_id } = payload;
    const result = await this.getList.getInstance().excute(filter, user_id);
    return result;
  }
}
