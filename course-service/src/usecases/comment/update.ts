import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { ICommentRepository } from 'src/domain/repositories/commentRepository.interface';

export class UpdateCommentUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: ICommentRepository,
  ) {}

  async excute(id: number, text: string) {
    if (!id || !text)
      throw new RpcException(new BadRequestException('mssing field'));

    const result = await this.repository.update(id, { text });

    return result;
  }
}
