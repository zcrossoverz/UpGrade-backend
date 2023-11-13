import { BadGatewayException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { ICourseRepository } from 'src/domain/repositories/courseRepository.interface';

export class EnrollCourseUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: ICourseRepository,
  ) {}

  async excute(course_id: number, user_id: number): Promise<boolean> {
    if (!course_id || !user_id) {
      throw new RpcException(
        new BadGatewayException('course id and user id is required'),
      );
    }
    const course = await this.repository.getCourse(course_id);
    if (!course)
      throw new RpcException(new BadGatewayException('course not found'));
    const { members_id, members_count } = course;
    const members = [];
    if (members_id !== null) {
      members.push(...members_id);
    }
    members.push(Number(user_id));
    const result = await this.repository.update(course_id, {
      members_id: members,
      members_count: members_count + 1,
    });

    return result;
  }
}
