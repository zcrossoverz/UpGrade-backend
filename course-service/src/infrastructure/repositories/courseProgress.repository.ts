import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Course } from '../entities/course.entity';
import { ICourseProgressRepository } from 'src/domain/repositories/courseProgress.interface';
import { CourseProgress } from '../entities/courseProgress.entity';
import { CourseProgressM } from 'src/domain/model/courseProgress';
import { IfilterSearch } from 'src/domain/constant/constant';

@Injectable()
export class CourseProgressRepository implements ICourseProgressRepository {
  constructor(
    @InjectRepository(CourseProgress)
    private readonly repository: Repository<CourseProgress>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(user_id: number, course_id: number): Promise<CourseProgressM> {
    if (!user_id || !course_id)
      throw new RpcException(
        new BadRequestException('user id and course id is required'),
      );

    const course = await this.courseRepository.findOne({
      where: {
        id: course_id,
      },
    });

    if (!course)
      throw new RpcException(new BadRequestException('course not found'));

    const result = await this.repository.save(
      this.repository.create({
        user_id,
        course,
      }),
    );

    return result;
  }
  async update(id: number, data: any): Promise<boolean> {
    if (!id) {
      throw new RpcException(new BadRequestException('id is required'));
    }
    const result = await this.repository.update(id, { ...data });
    return result.affected > 0;
  }
  async delete(id: number): Promise<boolean> {
    if (!id) {
      throw new RpcException(new BadRequestException('id is required'));
    }
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
  async getList(
    filter: IfilterSearch,
  ): Promise<{ datas: CourseProgressM[]; count: number }> {
    const { limit = 5, page = 1, order, query, exclude } = filter;

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

    const [datas, count] = await this.repository.findAndCount({
      where,
      ...(order ? { order: { [order.key]: order.value } } : {}),
      take: limit,
      skip: offset,
    });

    return {
      datas,
      count,
    };
  }
  async get(id: number): Promise<CourseProgressM> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
    });
    return result;
  }
}
