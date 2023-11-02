import { Injectable, Inject } from '@nestjs/common';
import { CATEGORY_MESSAGE_PATTERNS } from './messagePattern';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_SERVICE') private readonly client: ClientProxy,
  ) {}

  async create(createDto: { name: string; description: string }) {
    return this.client.send(CATEGORY_MESSAGE_PATTERNS.create, {
      ...createDto,
    });
  }

  async getList() {
    return this.client.send(CATEGORY_MESSAGE_PATTERNS.getList, {});
  }

  async update(id: number, name: string, description: string) {
    return this.client.send(CATEGORY_MESSAGE_PATTERNS.update, {
      id,
      name,
      description,
    });
  }

  async delete(id: number) {
    return this.client.send(CATEGORY_MESSAGE_PATTERNS.delete, { id });
  }
}
