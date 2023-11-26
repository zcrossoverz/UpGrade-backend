import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  UseCaseProxy,
  UsecasesProxyModule,
} from 'src/infrastructure/usecases-proxy/usecases-proxy.module';

import { GetOverviewAnalystic } from 'src/usecases/analytics/courseAnalystic';
import { ANALYTICS_MESSAGE_PATTERNS } from './messagePattern';

@Controller()
export class AnalyticsController {
  constructor(
    @Inject(UsecasesProxyModule.GET_OVERVIEW_ANALYTICS_USECASES_PROXY)
    private readonly getOverview: UseCaseProxy<GetOverviewAnalystic>,
  ) {}

  @MessagePattern(ANALYTICS_MESSAGE_PATTERNS.getOverview)
  async overview() {
    const result = await this.getOverview.getInstance().excute();
    return result;
  }
}
