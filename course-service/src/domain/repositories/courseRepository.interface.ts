import { CourseM } from '../model/course';

export interface ICourseRepository {
  create(
    title: string,
    instructor_id: number,
    description: string,
    thumbnail_url: string,
    category: number,
  ): Promise<CourseM>;
  getCourse(id: number): Promise<CourseM>;
  getList(): Promise<{ datas: CourseM[]; count: number }>;
  getListByKey(
    key: string,
    value: any,
  ): Promise<{ datas: CourseM[]; count: number }>;
}
