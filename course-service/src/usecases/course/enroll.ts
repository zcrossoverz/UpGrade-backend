import { BadGatewayException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { ICourseProgressRepository } from 'src/domain/repositories/courseProgress.interface';
import { ICourseRepository } from 'src/domain/repositories/courseRepository.interface';
import { ILibraryRepository } from 'src/domain/repositories/libraryRepository.interface';
import { INotificationRepository } from 'src/domain/repositories/notificationRepository.interface';

export class EnrollCourseUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: ICourseRepository,
    private readonly courseProgressRepository: ICourseProgressRepository,
    private readonly libraryRepository: ILibraryRepository,
    private readonly notificationRepository: INotificationRepository,
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
    if (course.price > 0) {
      throw new RpcException(
        new BadGatewayException('this course cannot enroll'),
      );
    }

    const courseProgress = await this.courseProgressRepository.create(
      user_id,
      course_id,
    );

    this.libraryRepository.add(user_id, courseProgress.id);
    this.notificationRepository.create(
      course.instructor_id,
      `user ${user_id} vua dang ky khoa hoc cua ban`,
      'test',
    );
    this.notificationRepository.create(
      user_id,
      `ban da dang ky khoa hoc thanh cong`,
      'test',
    );

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
