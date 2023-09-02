import { ILogger } from 'src/domain/logger/logger.interface';
import { CourseM } from 'src/domain/model/course';
import { ICourseRepository } from 'src/domain/repositories/courseRepository.interface';

export class GetCourseUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly courseRepository: ICourseRepository,
  ) {}

  async excute(id: number): Promise<CourseM> {
    const result = await this.courseRepository.getCourse(id);
    this.logger.log('GetCourseUseCase execute', 'return course');
    return result;
  }
}
