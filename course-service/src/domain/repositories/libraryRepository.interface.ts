import { IfilterSearch } from '../constant/constant';
import { LibraryM } from '../model/library';

export interface ILibraryRepository {
  add(user_id: number, course_progress_id: number): Promise<any>;
  update(id: number, data: any): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  getList(filter: IfilterSearch): Promise<{ datas: LibraryM[]; count: number }>;
  get(user_id: number): Promise<LibraryM>;
}
