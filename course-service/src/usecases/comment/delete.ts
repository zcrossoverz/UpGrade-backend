import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { ICommentRepository } from 'src/domain/repositories/commentRepository.interface';

export class DeleteCommentUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: ICommentRepository,
  ) {}

  async excute(id: number) {
    if (!id) throw new RpcException(new BadRequestException('mssing field'));

    const result = await this.repository.delete(id);

    return result;
  }
}
