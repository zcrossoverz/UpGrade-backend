import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { IReviewRepository } from 'src/domain/repositories/reviewRepository.interface';

export class DeleteReviewUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IReviewRepository,
  ) {}

  async excute(id: number) {
    if (!id) throw new RpcException(new BadRequestException('mssing field'));
    const result = await this.repository.delete(id);

    return result;
  }
}
