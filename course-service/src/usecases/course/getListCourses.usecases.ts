import { ILogger } from 'src/domain/logger/logger.interface';
import { CourseM } from 'src/domain/model/course';
import { ICourseRepository } from 'src/domain/repositories/courseRepository.interface';

export class GetListCoursesUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly courseRepository: ICourseRepository,
  ) {}

  async excute(data: {
    filter: {
      limit?: number;
      page?: number;
      order?: {
        key: string;
        value: string;
      };
      query?: {
        key: string;
        value: string;
      }[];
    };
  }): Promise<{ datas: CourseM[]; count: number }> {
    const result = await this.courseRepository.getList(data.filter);
    this.logger.log('GetListCoursesUseCase execute', 'return list course');
    return result;
  }
}
