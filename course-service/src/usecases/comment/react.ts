import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { ICommentRepository } from 'src/domain/repositories/commentRepository.interface';

export class ReactCommentUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: ICommentRepository,
  ) {}

  async excute(id: number, isLike: boolean, user_id: number) {
    if (!id || isLike === undefined)
      throw new RpcException(new BadRequestException('mssing field'));

    const result = await this.repository.react(id, isLike, user_id);

    return result;
  }
}
