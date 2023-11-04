import { ILogger } from 'src/domain/logger/logger.interface';
import { IUnitRepository } from 'src/domain/repositories/unitRepository.interface';

export class DeleteUnitUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitRepository: IUnitRepository,
  ) {}

  async excute(unit_id: number) {
    const result = this.unitRepository.delete(unit_id);
    return result;
  }
}
