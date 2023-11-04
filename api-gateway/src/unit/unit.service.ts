import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UNIT_MESSAGE_PATTERNS } from './messagePattern';

@Injectable()
export class UnitService {
  constructor(@Inject('UNIT_SERVICE') private readonly client: ClientProxy) {}

  async create(createDto: { title: string; course_id: number }) {
    return this.client.send(UNIT_MESSAGE_PATTERNS.create, {
      ...createDto,
    });
  }

  async update(title: string, unit_id: number) {
    return this.client.send(UNIT_MESSAGE_PATTERNS.update, {
      title,
      unit_id,
    });
  }

  async delete(id: number) {
    return this.client.send(UNIT_MESSAGE_PATTERNS.delete, { id });
  }
}
