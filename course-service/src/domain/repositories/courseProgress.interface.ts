import { IfilterSearch } from '../constant/constant';
import { CourseProgressM } from '../model/courseProgress';

export interface ICourseProgressRepository {
  create(user_id: number, course_id: number): Promise<CourseProgressM>;
  update(id: number, data: any): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  getList(
    filter: IfilterSearch,
  ): Promise<{ datas: CourseProgressM[]; count: number }>;
  get(id: number): Promise<CourseProgressM>;
}
