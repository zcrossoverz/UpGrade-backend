import { CourseM } from './course';
import { TopicM } from './topic';

export enum typeStatusUnit {
  PUBLISHED = 'published',
  PRIVATE = 'private',
  BLOCK = 'block',
}

export class UnitM {
  id: number;
  course: CourseM;
  title: string;
  status: typeStatusUnit;
  drive_folder_unit_id: string;
  topics: TopicM[];
  created_at: Date;
  updated_at: Date;
}
