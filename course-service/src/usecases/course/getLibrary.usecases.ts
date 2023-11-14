import { ILogger } from 'src/domain/logger/logger.interface';
import { LibraryM } from 'src/domain/model/library';
import { ILibraryRepository } from 'src/domain/repositories/libraryRepository.interface';

export class GetLibraryUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly libraryRepository: ILibraryRepository,
  ) {}

  async excute(user_id: number): Promise<LibraryM> {
    const library = await this.libraryRepository.get(user_id);
    return library;
  }
}
