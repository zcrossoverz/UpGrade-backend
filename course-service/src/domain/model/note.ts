import { TopicM } from './topic';

export class NoteM {
  id: number;

  user_id: number;

  comment: string;

  time: number;

  topic: TopicM;

  created_at: Date;

  updated_at: Date;
}
