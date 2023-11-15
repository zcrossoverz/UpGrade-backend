import { IfilterSearch } from 'src/domain/constant/constant';
import { ILogger } from 'src/domain/logger/logger.interface';
import { INoteRepository } from 'src/domain/repositories/noteRepository.interface';

export class GetListNoteUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: INoteRepository,
  ) {}

  async excute(filter: IfilterSearch) {
    const result = await this.repository.getList(filter);

    return result;
  }
}
