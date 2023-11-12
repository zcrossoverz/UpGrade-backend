import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { ApprovalRequestM } from 'src/domain/model/approvalRequest';
import { IApprovalRequestRepository } from 'src/domain/repositories/approvalRequestRepository.interface';

export class SubmitApprovalUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IApprovalRequestRepository,
  ) {}

  async excute(
    course_id: number,
    instructor_id: number,
    instructor_username: string,
  ): Promise<ApprovalRequestM> {
    if (!course_id || !instructor_id) {
      throw new RpcException(
        new BadRequestException('Course id and lecturer id are required'),
      );
    }
    const result = await this.repository.create(
      instructor_id,
      course_id,
      instructor_username,
    );
    return result;
  }
}
