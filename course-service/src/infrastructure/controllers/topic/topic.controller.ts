import { Controller, Inject, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  UseCaseProxy,
  UsecasesProxyModule,
} from 'src/infrastructure/usecases-proxy/usecases-proxy.module';

import { TOPIC_MESSAGE_PATTERNS } from './messagePattern';
import { CreateTopicUseCase } from 'src/usecases/topic/createTopic';
import { UpdateTopicUseCase } from 'src/usecases/topic/updateTopic';
import { DeleteTopicUseCase } from 'src/usecases/topic/deleteTopic';
import { GetTopicUseCase } from 'src/usecases/topic/getTopic';
import { GetListTopicUseCase } from 'src/usecases/topic/getListTopic';

@Controller('unit')
export class UnitController {
  constructor(
    @Inject(UsecasesProxyModule.CREATE_TOPIC_USECASES_PROXY)
    private readonly createUsecase: UseCaseProxy<CreateTopicUseCase>,
    @Inject(UsecasesProxyModule.UPDATE_TOPIC_USECASES_PROXY)
    private readonly updateUsecase: UseCaseProxy<UpdateTopicUseCase>,
    @Inject(UsecasesProxyModule.DELETE_TOPIC_USECASES_PROXY)
    private readonly deleteUsecase: UseCaseProxy<DeleteTopicUseCase>,
    @Inject(UsecasesProxyModule.GET_TOPIC_USECASES_PROXY)
    private readonly getOneUsecase: UseCaseProxy<GetTopicUseCase>,
    @Inject(UsecasesProxyModule.GETLIST_TOPIC_USECASES_PROXY)
    private readonly getListUsecase: UseCaseProxy<GetListTopicUseCase>,
  ) {}

  @MessagePattern(TOPIC_MESSAGE_PATTERNS.create)
  async create(
    @Payload()
    createDto: {
      title: string;
      description: string;
      video_url: string;
      unit_id: number;
    },
  ) {
    const { title, description, video_url, unit_id } = createDto;
    const result = await this.createUsecase
      .getInstance()
      .excute(title, description, video_url, unit_id);
    return result;
  }

  @MessagePattern(TOPIC_MESSAGE_PATTERNS.update)
  async update(
    @Payload()
    updateDto: {
      topic_id: number;
      title: string;
      description: string;
    },
  ) {
    const { topic_id, title, description } = updateDto;
    const result = await this.updateUsecase
      .getInstance()
      .excute(topic_id, title, description);
    return result;
  }

  @MessagePattern(TOPIC_MESSAGE_PATTERNS.delete)
  async delete(@Payload('id', ParseIntPipe) id: number) {
    const result = await this.deleteUsecase.getInstance().excute(id);
    return result;
  }
}