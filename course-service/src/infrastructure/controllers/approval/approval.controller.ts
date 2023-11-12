import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  UseCaseProxy,
  UsecasesProxyModule,
} from 'src/infrastructure/usecases-proxy/usecases-proxy.module';

import { APPROVAL_REQUEST_MESSAGE_PATTERNS } from './messagePattern';

import { SubmitApprovalUseCases } from 'src/usecases/approvalRequest/submitApproval';
import { ProcessApprovalUseCases } from 'src/usecases/approvalRequest/approvalProcess';
import { GetListApprovalUseCases } from 'src/usecases/approvalRequest/getList';
import { enumApprovalStatus } from 'src/domain/model/approvalRequest';

@Controller()
export class ApprovalRequestController {
  constructor(
    @Inject(UsecasesProxyModule.CREATE_APPROVAL_REQUEST_USECASES_PROXY)
    private readonly submmitApprovalUsecase: UseCaseProxy<SubmitApprovalUseCases>,
    @Inject(UsecasesProxyModule.PROCESS_APPROVAL_REQUEST_USECASES_PROXY)
    private readonly processApprovalUsecase: UseCaseProxy<ProcessApprovalUseCases>,
    @Inject(UsecasesProxyModule.GET_LIST_APPROVAL_REQUEST_USECASES_PROXY)
    private readonly getListUsecase: UseCaseProxy<GetListApprovalUseCases>,
  ) {}

  @MessagePattern(APPROVAL_REQUEST_MESSAGE_PATTERNS.submitApprovalRequest)
  async create(
    @Payload()
    createDto: {
      course_id: number;
      instructor_id: number;
      instructor_username: string;
    },
  ) {
    const { course_id, instructor_id, instructor_username } = createDto;
    const result = await this.submmitApprovalUsecase
      .getInstance()
      .excute(course_id, instructor_id, instructor_username);
    return result;
  }

  @MessagePattern(APPROVAL_REQUEST_MESSAGE_PATTERNS.processApprovalRequest)
  async update(
    @Payload()
    updateDto: {
      id: number;
      approver_id: number;
      status: enumApprovalStatus;
      approver_fullname: string;
    },
  ) {
    const { id, approver_id, status, approver_fullname } = updateDto;
    const result = await this.processApprovalUsecase
      .getInstance()
      .excute(id, approver_id, status, approver_fullname);
    return result;
  }

  @MessagePattern(APPROVAL_REQUEST_MESSAGE_PATTERNS.getListApprovalRequest)
  async getList() {
    const result = await this.getListUsecase.getInstance().excute();
    return result;
  }
}
