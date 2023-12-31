import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { IfilterSearch } from 'src/domain/constant/constant';
import { IReviewRepository } from 'src/domain/repositories/reviewRepository.interface';
import { ReviewM } from 'src/domain/model/review';
import { Review } from '../entities/review.entity';
import { Course } from '../entities/course.entity';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  constructor(
    @InjectRepository(Review)
    private readonly repository: Repository<Review>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Notification)
    private readonly notiRepository: Repository<Notification>,
  ) {}

  async create(
    course_id: number,
    rate: number,
    comment: string,
    user_id: number,
    user_fullname: string,
    user_avatar: string,
    user_email: string,
  ): Promise<ReviewM> {
    if (!course_id || !rate || !user_id || !user_fullname) {
      throw new RpcException(
        new BadRequestException('field required cannot empty'),
      );
    }

    const course = await this.courseRepository.findOne({
      where: {
        id: course_id,
      },
    });

    if (!course) {
      throw new RpcException(new BadRequestException('course not found'));
    }
    const result = await this.repository.save(
      this.repository.create({
        course,
        comment,
        rate,
        reviewer_id: user_id,
        reviewer_fullname: user_fullname,
        reviewer_avatar: user_avatar,
        reviewer_email: user_email,
        course_id,
      }),
    );

    const [data, count] = await this.repository.findAndCount({
      where: {
        course_id,
      },
    });

    const totalRate = data.reduce((sum, review) => {
      if (review.hasOwnProperty('rate')) {
        return sum + review.rate;
      } else {
        return sum;
      }
    }, 0);

    const newRate = `${parseFloat((totalRate / count).toFixed(1))}`;

    course.rate = newRate;
    course.rate_number = count;
    this.courseRepository.save(course);

    this.notiRepository.save(
      this.notiRepository.create({
        user_id: course.instructor_id,
        text: `${user_fullname} vừa đánh giá ${rate} sao cho khóa học của bạn! Xem ngay!`,
        href: `/admin/course-management/details/${course.id}`,
      }),
    );

    return result;
  }

  async update(id: number, data: any): Promise<boolean> {
    if (!id) {
      throw new RpcException(new BadRequestException('id is required'));
    }
    const result = await this.repository.update(id, { ...data });

    const review = await this.repository.findOne({
      where: {
        id,
      },
    });
    const course_id = review.course_id;

    const [listReview, count] = await this.repository.findAndCount({
      where: {
        course_id,
      },
    });

    const totalRate = listReview.reduce((sum, review) => {
      if (review.hasOwnProperty('rate')) {
        return sum + review.rate;
      } else {
        return sum;
      }
    }, 0);

    const newRate = `${parseFloat((totalRate / count).toFixed(1))}`;

    this.courseRepository.update(
      {
        id: course_id,
      },
      {
        rate: newRate,
        rate_number: count,
      },
    );

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
  ): Promise<{ datas: ReviewM[]; count: number }> {
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
  async get(id: number): Promise<ReviewM> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
    });
    return result;
  }
}
