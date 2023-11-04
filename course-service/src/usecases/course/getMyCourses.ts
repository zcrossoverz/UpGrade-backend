import { ILogger } from 'src/domain/logger/logger.interface';
import { CourseM } from 'src/domain/model/course';
import { ICourseRepository } from 'src/domain/repositories/courseRepository.interface';

export class GetMyCoursesUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly courseRepository: ICourseRepository,
  ) {}

  async excute(
    instructor_id: number,
  ): Promise<{ datas: CourseM[]; count: number }> {
    const result = await this.courseRepository.getListByKey(
      'instructor_id',
      instructor_id,
    );
    this.logger.log('GetListCoursesUseCase execute', 'return list course');
    return result;
  }
}
