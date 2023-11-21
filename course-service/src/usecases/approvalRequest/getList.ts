import { IfilterSearch } from 'src/domain/constant/constant';
import { ILogger } from 'src/domain/logger/logger.interface';
import { ApprovalRequestM } from 'src/domain/model/approvalRequest';
import { IApprovalRequestRepository } from 'src/domain/repositories/approvalRequestRepository.interface';

export class GetListApprovalUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IApprovalRequestRepository,
  ) {}

  async excute(
    filter: IfilterSearch,
  ): Promise<{ datas: ApprovalRequestM[]; count: number }> {
    const result = await this.repository.getList(filter);
    return result;
  }
}
