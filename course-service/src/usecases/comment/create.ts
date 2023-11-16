import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { ICommentRepository } from 'src/domain/repositories/commentRepository.interface';
import { enumCommentRole } from 'src/infrastructure/entities/comment.entity';

export class CreateCommentUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: ICommentRepository,
  ) {}

  async excute(
    topic_id: number,
    user_id: number,
    user_avatar: string,
    user_fullname: string,
    user_email: string,
    user_role: enumCommentRole,
    text: string,
    parent_id?: number,
  ) {
    if (
      !user_id ||
      !topic_id ||
      !user_email ||
      !user_fullname ||
      !user_role ||
      !text
    )
      throw new RpcException(new BadRequestException('mssing field'));

    const result = await this.repository.create(
      topic_id,
      user_id,
      user_avatar,
      user_fullname,
      user_email,
      user_role,
      text,
      parent_id,
    );

    return result;
  }
}
