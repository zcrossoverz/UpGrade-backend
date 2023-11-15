import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { INoteRepository } from 'src/domain/repositories/noteRepository.interface';

export class DeleteNoteUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: INoteRepository,
  ) {}

  async excute(id: number) {
    if (!id) throw new RpcException(new BadRequestException('mssing field'));

    const result = await this.repository.delete(id);

    return result;
  }
}
