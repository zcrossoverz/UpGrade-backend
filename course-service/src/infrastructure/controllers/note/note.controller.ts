import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  UseCaseProxy,
  UsecasesProxyModule,
} from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { CreateNoteUseCase } from 'src/usecases/note/add';
import { DeleteNoteUseCase } from 'src/usecases/note/delete';
import { GetListNoteUseCase } from 'src/usecases/note/getList';
import { NOTE_MESSAGE_PATTERNS } from './messagePattern';
import { IfilterSearch } from 'src/domain/constant/constant';

@Controller()
export class NoteController {
  constructor(
    @Inject(UsecasesProxyModule.ADD_NOTE_USECASES_PROXY)
    private readonly addNote: UseCaseProxy<CreateNoteUseCase>,
    @Inject(UsecasesProxyModule.GETLIST_NOTE_USECASES_PROXY)
    private readonly getList: UseCaseProxy<GetListNoteUseCase>,
    @Inject(UsecasesProxyModule.DELETE_NOTE_USECASES_PROXY)
    private readonly deleteNote: UseCaseProxy<DeleteNoteUseCase>,
  ) {}

  @MessagePattern(NOTE_MESSAGE_PATTERNS.add)
  async add(
    @Payload()
    payload: {
      user_id: number;
      comment: string;
      time: number;
      topic_id: number;
    },
  ) {
    const { user_id, comment, time, topic_id } = payload;

    const result = await this.addNote
      .getInstance()
      .excute(user_id, comment, time, topic_id);
    return result;
  }

  @MessagePattern(NOTE_MESSAGE_PATTERNS.getList)
  async getListNote(
    @Payload()
    payload: {
      filter: IfilterSearch;
    },
  ) {
    const { filter } = payload;
    const result = await this.getList.getInstance().excute(filter);
    return result;
  }

  @MessagePattern(NOTE_MESSAGE_PATTERNS.delete)
  async delete(
    @Payload()
    payload: {
      id: number;
    },
  ) {
    const { id } = payload;
    const result = await this.deleteNote.getInstance().excute(id);
    return result;
  }
}
