import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ANALYTICS_MESSAGE_PATTERNS } from './messagePattern';

@Injectable()
export class AnalysticService {
  constructor(
    @Inject('ANALYSTIC_SERVICE') private readonly client: ClientProxy,
  ) {}

  async getOverview() {
    return this.client.send(ANALYTICS_MESSAGE_PATTERNS.getOverview, {});
  }
}
