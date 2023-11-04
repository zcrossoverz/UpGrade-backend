import { UnitM } from './unit';

export enum typeTopic {
  POST = 'post',
  VIDEO = 'video',
  QUIZ = 'quiz',
  EXAM = 'exam',
}

export class TopicM {
  id: number;
  title: string;
  video_url: string;
  description: string;
  unit: UnitM;
  created_at: Date;
  updated_at: Date;
}
