import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IApprovalRequestRepository } from 'src/domain/repositories/approvalRequestRepository.interface';
import {
  ApprovalRequestM,
  enumApprovalStatus,
} from 'src/domain/model/approvalRequest';
import { RpcException } from '@nestjs/microservices';
import { ApprovalRequest } from '../entities/approvalRequest.entity';
import { Course } from '../entities/course.entity';
import { typeStatusCourse } from 'src/domain/model/course';

@Injectable()
export class ApprovalRequestRepository implements IApprovalRequestRepository {
  constructor(
    @InjectRepository(ApprovalRequest)
    private readonly approvalRequestRepository: Repository<ApprovalRequest>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
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
  async getList(): Promise<{ datas: ApprovalRequestM[]; count: number }> {
    const [datas, count] = await this.approvalRequestRepository.findAndCount();
    return { datas, count };
  }
  async get(id: number): Promise<ApprovalRequestM> {
    const result = await this.approvalRequestRepository.findOne({
      where: { id },
    });
    return result;
  }
}
