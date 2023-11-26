import { ILogger } from 'src/domain/logger/logger.interface';
import { IAnalysticRepository } from 'src/domain/repositories/analystRepository.interface';

export class GetOverviewAnalystic {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IAnalysticRepository,
  ) {}

  async excute(): Promise<any> {
    return this.repository.getOverviewAnalytics();
  }
}
