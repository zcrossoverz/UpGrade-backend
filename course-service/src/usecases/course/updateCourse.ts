import { ILogger } from 'src/domain/logger/logger.interface';
import { ICourseRepository } from 'src/domain/repositories/courseRepository.interface';

export class UpdateCoursesUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly courseRepository: ICourseRepository,
  ) {}

  async excute(course_id: number, data: any): Promise<boolean> {
    const result = await this.courseRepository.update(course_id, data);
    return result;
  }
}
