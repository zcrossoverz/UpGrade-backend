import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { INoteRepository } from 'src/domain/repositories/noteRepository.interface';

export class CreateNoteUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: INoteRepository,
  ) {}

  async excute(
    user_id: number,
    comment: string,
    time: number,
    topic_id: number,
  ) {
    if (!user_id || !comment || !time || !topic_id)
      throw new RpcException(new BadRequestException('mssing field'));

    const result = await this.repository.create(
      user_id,
      comment,
      time,
      topic_id,
    );

    return result;
  }
}
