import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { IReviewRepository } from 'src/domain/repositories/reviewRepository.interface';

export class CreateReviewUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IReviewRepository,
  ) {}

  async excute(
    course_id: number,
    user_id: number,
    user_email: string,
    user_fullname: string,
    user_avatar: string,
    rate: number,
    comment: string,
  ) {
    if (
      !user_id ||
      !course_id ||
      !user_email ||
      !user_fullname ||
      !rate ||
      !comment
      // !user_avatar
    )
      throw new RpcException(new BadRequestException('mssing field'));

    const result = await this.repository.create(
      course_id,
      rate,
      comment,
      user_id,
      user_fullname,
      user_avatar,
      user_email,
    );

    return result;
  }
}
