import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { CourseM } from 'src/domain/model/course';
import { ICourseRepository } from 'src/domain/repositories/courseRepository.interface';

export class CreateDraftCourseUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly courseRepository: ICourseRepository,
  ) {}

  async excute(
    title: string,
    instructor_id: number,
    description: string,
    thumbnail: string,
    category: number,
  ): Promise<CourseM> {
    if (!title || !instructor_id)
      throw new RpcException(
        new BadRequestException('Title and instructor id are required'),
      );

    if (!category) {
      throw new RpcException(new BadRequestException('category are required'));
    }

    if (!thumbnail) {
      throw new RpcException(new BadRequestException('Thumbnail are required'));
    }

    const result = await this.courseRepository.create(
      title,
      instructor_id,
      description,
      thumbnail,
      category,
    );
    this.logger.log(
      'creaetDraftCourseUseCases execute',
      'New draft course have been created',
    );
    return result;
  }
}
