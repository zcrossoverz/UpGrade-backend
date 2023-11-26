import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { enumApprovalStatus } from 'src/domain/model/approvalRequest';
import { IApprovalRequestRepository } from 'src/domain/repositories/approvalRequestRepository.interface';
import { INotificationRepository } from 'src/domain/repositories/notificationRepository.interface';

export class ProcessApprovalUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IApprovalRequestRepository,
    private readonly notiRepository: INotificationRepository,
  ) {}

  async excute(
    id: number,
    approver_id: number,
    status: enumApprovalStatus,
    approver_fullname: string,
  ): Promise<boolean> {
    if (!id || !approver_id || !status) {
      throw new RpcException(
        new BadRequestException('Id, approver id and status are required'),
      );
    }

    const course = await this.repository.get(id);

    this.notiRepository.create(
      course.instructor_id,
      `${approver_fullname} vừa phê duyệt khóa học của bạn!`,
      `/admin/course-management/details/${course.id}`,
    );

    const result = await this.repository.update(id, {
      approver_id,
      status,
      approver_fullname,
    });
    return result;
  }
}
