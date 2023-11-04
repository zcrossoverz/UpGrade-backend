import { ILogger } from 'src/domain/logger/logger.interface';
import { IUnitRepository } from 'src/domain/repositories/unitRepository.interface';

export class CreateUnitUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitRepository: IUnitRepository,
  ) {}

  async excute(title: string, course_id: number) {
    const result = this.unitRepository.create(title, course_id);
    return result;
  }
}
