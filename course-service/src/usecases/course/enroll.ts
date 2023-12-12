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

  async excute(
    course_id: number,
    user_id: number,
    user_fullname: string,
  ): Promise<boolean> {
    if (!course_id || !user_id) {
      throw new RpcException(
        new BadGatewayException('course id and user id is required'),
      );
    }
    const course = await this.repository.getCourse(course_id);
    if (!course)
      throw new RpcException(new BadGatewayException('course not found'));

    const courseProgress = await this.courseProgressRepository.create(
      user_id,
      course_id,
    );

    this.libraryRepository.add(user_id, courseProgress.id);
    this.notificationRepository.create(
      course.instructor_id,
      `Người dùng ${user_fullname} vừa đăng ký khóa học của bạn!`,
      `/course-details/${course.id}`,
    );

    this.notificationRepository.create(
      user_id,
      `Chúc mừng! bạn đã đăng ký khóa học ${course.title} thành công!!`,
      `/my-library`,
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
