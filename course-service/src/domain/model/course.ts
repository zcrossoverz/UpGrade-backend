import { CategoryM } from './category';
import { UnitM } from './unit';

export enum typeStatusCourse {
  INIT = 'init',
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export class CourseM {
  id: number;
  title: string;
  description: string;
  instructor_id: number;
  price: number;
  thumbnail_url: string;
  status: typeStatusCourse;
  category: CategoryM;
  units: UnitM[];
  created_at: Date;
  updated_at: Date;
}
