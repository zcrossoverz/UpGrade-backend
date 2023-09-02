import { CourseM } from '../model/course';

export interface ICourseRepository {
  create(title: string, instructor_id: number): Promise<CourseM>;
  getCourse(id: number): Promise<CourseM>;
  getList(): Promise<{ datas: CourseM[]; count: number }>;
}
