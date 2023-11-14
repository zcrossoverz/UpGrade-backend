import { CourseM } from './course';
import { TopicM } from './topic';

export class CourseProgressM {
  id: number;

  user_id: number;

  course: CourseM;

  currentTopic: TopicM;

  topicCompleted: TopicM[];

  created_at: Date;

  updated_at: Date;
}
