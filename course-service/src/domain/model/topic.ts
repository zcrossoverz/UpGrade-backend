import { UnitM } from './unit';

export enum typeTopic {
  POST = 'post',
  VIDEO = 'video',
  QUIZ = 'quiz',
  EXAM = 'exam',
}

export enum typeStatusTopic {
  PUBLISHED = 'published',
  PRIVATE = 'private',
  BLOCK = 'block',
}

export class TopicM {
  id: number;
  title: string;
  video_url: string;
  description: string;
  file_id: string;
  unit: UnitM;
  status: typeStatusTopic;
  created_at: Date;
  updated_at: Date;
}
