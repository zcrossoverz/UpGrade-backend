import { CourseM } from './course';
import { TopicM } from './topic';

export class UnitM {
  id: number;
  course: CourseM;
  title: string;
  topics: TopicM[];
  created_at: Date;
  updated_at: Date;
}
