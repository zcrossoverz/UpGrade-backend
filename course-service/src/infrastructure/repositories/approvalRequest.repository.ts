import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { IApprovalRequestRepository } from 'src/domain/repositories/approvalRequestRepository.interface';
import {
  ApprovalRequestM,
  enumApprovalStatus,
} from 'src/domain/model/approvalRequest';
import { RpcException } from '@nestjs/microservices';
import { ApprovalRequest } from '../entities/approvalRequest.entity';
import { Course } from '../entities/course.entity';
import { typeStatusCourse } from 'src/domain/model/course';
import { IfilterSearch } from 'src/domain/constant/constant';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class ApprovalRequestRepository implements IApprovalRequestRepository {
  constructor(
    @InjectRepository(ApprovalRequest)
    private readonly approvalRequestRepository: Repository<ApprovalRequest>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Notification)
    private readonly notiRepository: Repository<Notification>,
  ) {}
  async create(
    instructor_id: number,
    course_id: number,
    instructor_username: string,
  ): Promise<ApprovalRequestM> {
    if (!instructor_id || !course_id) {
      throw new RpcException(
        new BadRequestException('instructor_id, course_id are required'),
      );
    }

    const course = await this.courseRepository.findOne({
      where: {
        id: course_id,
      },
    });
    if (!course)
      throw new RpcException(new BadRequestException('Course not found'));

    const result = await this.approvalRequestRepository.save(
      this.approvalRequestRepository.create({
        instructor_id,
        course_id,
        course_title: course.title,
        instructor_username,
      }),
    );
    await this.courseRepository.update(
      {
        id: course_id,
      },
      {
        status: typeStatusCourse.SUBMIT,
      },
    );
    this.notiRepository.save(
      this.notiRepository.create({
        user_id: 1,
        text: `${instructor_username} vừa gửi yêu cầu phê duyệt khóa học ${course.title}!`,
        href: '/admin/approval-request',
        isRead: false,
      }),
    );

    return result;
  }
  async update(id: number, data: any): Promise<boolean> {
    if (!id) {
      throw new RpcException(new BadRequestException('id is required'));
    }
    const approvalRequest = await this.approvalRequestRepository.findOne({
      where: { id },
    });
    if (!approvalRequest)
      throw new RpcException(
        new BadRequestException('Cannot find approval request'),
      );
    const result = await this.approvalRequestRepository.update(id, { ...data });
    await this.courseRepository.update(
      {
        id: approvalRequest.course_id,
      },
      {
        status:
          data.status === enumApprovalStatus.APPROVED
            ? typeStatusCourse.PUBLISHED
            : typeStatusCourse.REJECTED,
      },
    );
    return result.affected > 0;
  }

  async delete(id: number): Promise<boolean> {
    if (!id) {
      throw new RpcException(new BadRequestException('id is required'));
    }
    const result = await this.approvalRequestRepository.delete(id);
    return result.affected > 0;
  }
  async getList(
    filter: IfilterSearch,
  ): Promise<{ datas: ApprovalRequestM[]; count: number }> {
    const { limit = 5, page = 1, order, query, exclude, explicit } = filter;

    const offset = (page - 1) * limit;

    const where: Record<string, any> = {};
    if (query) {
      query.forEach(({ key, value }) => {
        where[key] = ILike(`%${value}%`);
      });
    }

    if (exclude) {
      exclude.forEach(({ key, value }) => {
        where[key] = Not(value);
      });
    }

    if (explicit) {
      explicit.forEach(({ key, value }) => {
        where[key] = value;
      });
    }

    const [datas, count] = await this.approvalRequestRepository.findAndCount({
      where,
      ...(order ? { order: { [order.key]: order.value } } : {}),
      take: limit,
      skip: offset,
    });
    return { datas, count };
  }
  async get(id: number): Promise<ApprovalRequestM> {
    const result = await this.approvalRequestRepository.findOne({
      where: { id },
    });
    return result;
  }
}
