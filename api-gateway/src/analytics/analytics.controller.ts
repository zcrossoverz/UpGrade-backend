import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth';
import { AnalysticService } from './analytics.service';

@Controller('analystic')
export class AnalysticController {
  constructor(private readonly service: AnalysticService) {}

  @UseGuards(AuthGuard)
  @Post('/get-overview')
  getUnread() {
    return this.service.getOverview();
  }
}
