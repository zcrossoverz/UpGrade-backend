import { ILogger } from 'src/domain/logger/logger.interface';
import { CourseM } from 'src/domain/model/course';
import { ICourseRepository } from 'src/domain/repositories/courseRepository.interface';

export class GetListCoursesUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly courseRepository: ICourseRepository,
  ) {}

  async excute(): Promise<{ datas: CourseM[]; count: number }> {
    const result = await this.courseRepository.getList();
    this.logger.log('GetListCoursesUseCase execute', 'return list course');
    return result;
  }
}
