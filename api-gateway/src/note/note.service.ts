import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NOTE_MESSAGE_PATTERNS } from './messagePattern';
import { IfilterSearch } from 'src/common/interface/filterSearch';

@Injectable()
export class NoteService {
  constructor(@Inject('NOTE_SERVICE') private readonly client: ClientProxy) {}

  async add(user_id: number, comment: string, time: number, topic_id: number) {
    return this.client.send(NOTE_MESSAGE_PATTERNS.add, {
      user_id,
      comment,
      time,
      topic_id,
    });
  }

  async getList(filter: IfilterSearch) {
    return this.client.send(NOTE_MESSAGE_PATTERNS.getList, {
      filter,
    });
  }

  async delete(id: number) {
    return this.client.send(NOTE_MESSAGE_PATTERNS.delete, {
      id,
    });
  }
}
