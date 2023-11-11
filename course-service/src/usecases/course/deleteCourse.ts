import { ILogger } from 'src/domain/logger/logger.interface';
import { ICourseRepository } from 'src/domain/repositories/courseRepository.interface';

export class DeleteCourseUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly courseRepository: ICourseRepository,
  ) {}

  async excute(id: number): Promise<boolean> {
    const result = await this.courseRepository.delete(id);
    return result;
  }
}
