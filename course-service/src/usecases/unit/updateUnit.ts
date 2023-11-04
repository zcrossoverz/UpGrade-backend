import { ILogger } from 'src/domain/logger/logger.interface';
import { IUnitRepository } from 'src/domain/repositories/unitRepository.interface';

export class UpdateUnitUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitRepository: IUnitRepository,
  ) {}

  async excute(unit_id: number, title: string) {
    const result = this.unitRepository.update(unit_id, title);
    return result;
  }
}
