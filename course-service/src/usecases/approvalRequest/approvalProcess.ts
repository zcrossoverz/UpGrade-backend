import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { enumApprovalStatus } from 'src/domain/model/approvalRequest';
import { IApprovalRequestRepository } from 'src/domain/repositories/approvalRequestRepository.interface';

export class ProcessApprovalUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IApprovalRequestRepository,
  ) {}

  async excute(
    id: number,
    approver_id: number,
    status: enumApprovalStatus,
  ): Promise<boolean> {
    if (!id || !approver_id || !status) {
      throw new RpcException(
        new BadRequestException('Id, approver id and status are required'),
      );
    }

    const result = await this.repository.update(id, { approver_id, status });
    return result;
  }
}
