import { CourseProgressM } from './courseProgress';

export class LibraryM {
  id: number;

  user_id: number;

  courses: CourseProgressM[];

  count: number;

  created_at: Date;

  updated_at: Date;
}
