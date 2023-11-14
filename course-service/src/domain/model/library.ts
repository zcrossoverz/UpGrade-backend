import { CourseProgressM } from './courseProgress';

export class LibraryM {
  id: number;

  user_id: number;

  courses: CourseProgressM[];

  created_at: Date;

  updated_at: Date;
}
