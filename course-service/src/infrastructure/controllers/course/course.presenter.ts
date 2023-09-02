import { typeStatusCourse } from 'src/domain/model/course';

export class Course {
  id: number;
  title: string;
  description: string;
  instructor_id: number;
  price: number;
  thumbnail_url: string;
  status: typeStatusCourse;
  //update_history_id: number;
  created_at: Date;
  updated_at: Date;
}
