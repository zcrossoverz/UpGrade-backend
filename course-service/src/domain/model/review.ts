import { CourseM } from './course';

export class ReviewM {
  id: number;

  course: CourseM;

  comment: string;

  rate: number;

  reviewer_id: number;

  reviewer_fullname: string;

  reviewer_avatar: string;

  reviewer_email: string;

  created_at: Date;

  updated_at: Date;
}
