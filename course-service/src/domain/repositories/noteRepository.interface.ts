import { IfilterSearch } from '../constant/constant';
import { NoteM } from '../model/note';

export interface INoteRepository {
  create(
    user_id: number,
    comment: string,
    time: number,
    topic_id: number,
  ): Promise<NoteM>;
  update(id: number, data: any): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  getList(filter: IfilterSearch): Promise<{ datas: NoteM[]; count: number }>;
  get(id: number): Promise<NoteM>;
}
