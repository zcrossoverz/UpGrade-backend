export enum typeTopic {
  POST = 'post',
  VIDEO = 'video',
  QUIZ = 'quiz',
  EXAM = 'exam',
}

export class TopicM {
  id: number;
  unit_id: number;
  title: string;
  type: typeTopic;
  update_history_id: number;
  created_at: Date;
  updated_at: Date;
}
