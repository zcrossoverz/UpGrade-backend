import { IfilterSearch } from '../constant/constant';
import { CourseM } from '../model/course';

export interface ICourseRepository {
  create(
    title: string,
    instructor_id: number,
    description: string,
    thumbnail_url: string,
    category: number,
    drive_folder_id: string,
    instructor_fullname: string,
  ): Promise<CourseM>;
  getCourse(id: number): Promise<CourseM>;
  getList(filter: IfilterSearch): Promise<{ datas: CourseM[]; count: number }>;
  getListByKey(
    key: string,
    value: any,
  ): Promise<{ datas: CourseM[]; count: number }>;
  delete(id: number): Promise<boolean>;
  update(course_id: number, data: any): Promise<boolean>;
}
