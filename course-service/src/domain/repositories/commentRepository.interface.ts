import { enumCommentRole } from 'src/infrastructure/entities/comment.entity';
import { IfilterSearch } from '../constant/constant';
import { CommentM } from '../model/comment';

export interface ICommentRepository {
  create(
    topic_id: number,
    user_id: number,
    user_avatar: string,
    user_fullname: string,
    user_email: string,
    user_role: enumCommentRole,
    text: string,
    parent_id?: number,
  ): Promise<CommentM>;
  update(id: number, data: any): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  getList(filter: IfilterSearch): Promise<{ datas: CommentM[]; count: number }>;
  get(id: number): Promise<CommentM>;
  react(id: number, isLike: boolean, user_id: number);
}
