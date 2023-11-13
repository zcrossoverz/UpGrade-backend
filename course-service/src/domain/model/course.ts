import { CategoryM } from './category';
import { UnitM } from './unit';

export enum typeStatusCourse {
  INIT = 'init',
  DRAFT = 'draft',
  SUBMIT = 'submitted',
  REJECTED = 'rejected',
  PUBLISHED = 'published',
  PRIVATE = 'private',
  BLOCK = 'block',
}

export class CourseM {
  id: number;
  title: string;
  description: string;
  instructor_id: number;
  instructor_fullname: string;
  price: number;
  thumbnail_url: string;
  drive_folder_id: string;
  status: typeStatusCourse;
  category: CategoryM;
  units: UnitM[];
  members_id?: number[];
  members_count: number;
  created_at: Date;
  updated_at: Date;
}
