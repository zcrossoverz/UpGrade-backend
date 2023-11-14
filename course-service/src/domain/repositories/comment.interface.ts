import { enumCommentRole } from 'src/infrastructure/entities/comment.entity';
import { IfilterSearch } from '../constant/constant';
import { CommentM } from '../model/comment';

export interface ICommentRepository {
  create(
    user_id: number,
    user_fullname: string,
    user_avatar: string,
    user_role: enumCommentRole,
    topic_id: number,
    parent_id?: number,
  ): Promise<CommentM>;
  update(id: number, data: any): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  getList(filter: IfilterSearch): Promise<{ datas: CommentM[]; count: number }>;
  get(id: number): Promise<CommentM>;
}
