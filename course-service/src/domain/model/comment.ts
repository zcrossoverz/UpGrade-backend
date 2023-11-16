import { enumCommentRole } from 'src/infrastructure/entities/comment.entity';
import { TopicM } from './topic';

export class CommentM {
  id: number;

  text: string;

  user_id: number;

  user_fullname: string;

  user_avatar: string;

  user_email: string;

  user_role: enumCommentRole;

  topic_id: number;

  topic: TopicM;

  parent?: CommentM;

  children?: CommentM[];

  likes?: number[];

  dislikes?: number[];

  created_at: Date;

  updated_at: Date;
}
