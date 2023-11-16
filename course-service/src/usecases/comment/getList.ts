import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IfilterSearch } from 'src/domain/constant/constant';
import { ILogger } from 'src/domain/logger/logger.interface';
import { ICommentRepository } from 'src/domain/repositories/commentRepository.interface';

export class GetListCommentUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: ICommentRepository,
  ) {}

  async excute(filter: IfilterSearch) {
    if (!filter)
      throw new RpcException(new BadRequestException('mssing field'));

    const result = await this.repository.getList(filter);

    return result;
  }
}
