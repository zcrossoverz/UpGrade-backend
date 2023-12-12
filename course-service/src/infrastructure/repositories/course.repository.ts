import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { ICourseRepository } from 'src/domain/repositories/courseRepository.interface';
import { CourseM, typeStatusCourse } from 'src/domain/model/course';
import { Course } from '../entities/course.entity';
import { Category } from '../entities/category.entity';
import { RpcException } from '@nestjs/microservices';
import { IfilterSearch } from 'src/domain/constant/constant';

@Injectable()
export class CourseRepository implements ICourseRepository {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async update(course_id: number, data: any): Promise<boolean> {
    delete data.course_id;
    const result = await this.courseRepository.update(course_id, { ...data });
    return result.affected > 0;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.courseRepository.delete(id);
    return result.affected > 0;
  }

  async create(
    title: string,
    instructor_id: number,
    description: string,
    thumbnail_url: string,
    category: number,
    drive_folder_id: string,
    instructor_fullname: string,
  ): Promise<CourseM> {
    const categorySelect = await this.categoryRepository.findOneBy({
      id: category,
    });

    if (!categorySelect) {
      throw new RpcException(new BadRequestException('category not found'));
    }

    const result = await this.courseRepository.save(
      this.courseRepository.create({
        title,
        instructor_id,
        description: description,
        price: 0,
        thumbnail_url: thumbnail_url,
        status: typeStatusCourse.DRAFT,
        category: categorySelect,
        drive_folder_id,
        members_count: 0,
        instructor_fullname,
      }),
    );
    return result;
  }
  async getCourse(id: number): Promise<CourseM> {
    const result = await this.courseRepository.findOne({
      where: {
        id,
      },
      relations: {
        category: true,
        units: {
          topics: true,
        },
      },
      order: {
        id: 'ASC',
        units: {
          id: 'ASC',
          topics: {
            id: 'ASC',
          },
        },
      },
    });
    return result;
  }

  async getList(
    filter: IfilterSearch,
  ): Promise<{ datas: CourseM[]; count: number }> {
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

    try {
      const [datas, count] = await this.courseRepository.findAndCount({
        where,
        ...(order ? { order: { [order.key]: order.value } } : {}),
        take: limit,
        skip: offset,
      });
      return {
        datas,
        count,
      };
    } catch (error) {
      console.log(error);
      throw new RpcException(new BadRequestException('course not found'));
    }
  }

  async getListByKey(
    key: string,
    value: any,
  ): Promise<{ datas: CourseM[]; count: number }> {
    const [datas, count] = await this.courseRepository.findAndCount({
      [key]: value,
    });
    return {
      datas,
      count,
    };
  }
  async getListRecommend(user_id: number): Promise<any> {
    const courses = await this.courseRepository.find({
      relations: {
        reviews: true,
      },
    });
    const enrollments = [];

    courses.forEach((e) => {
      e.members_id?.forEach((member_id) => {
        const enrollment = {
          user_id: Number(member_id),
          course_id: e.id,
          rate: null,
        };
        const userReview = e.reviews?.find(
          (review) => review.reviewer_id === enrollment.user_id,
        );
        if (userReview) {
          enrollment.rate = userReview.rate;
        }
        enrollments.push(enrollment);
      });
    });

    const userEnrollments = enrollments.filter(
      (enrollment) => enrollment.user_id === user_id,
    );
    const userCourses = userEnrollments.map(
      (enrollment) => enrollment.course_id,
    );

    const recommendations = [];

    for (const course of courses) {
      if (!userCourses.includes(course.id)) {
        const ratingsForCourse = enrollments
          .filter(
            (enrollment) =>
              enrollment.course_id === course.id && enrollment.rate !== null,
          )
          .map((enrollment) => enrollment.rate);

        if (ratingsForCourse.length > 0) {
          const averageRating =
            ratingsForCourse.reduce((sum, rating) => sum + rating, 0) /
            ratingsForCourse.length;
          recommendations.push({
            ...course,
            averageRating,
          });
        } else {
          // If no non-null ratings, add the course with a lower priority
          recommendations.push({
            ...course,
            averageRating: null,
          });
        }
      }
    }

    // Sort recommendations by average rating (descending order)
    recommendations.sort((a, b) => {
      // If both have null ratings, maintain the original order
      if (a.averageRating === null && b.averageRating === null) {
        return 0;
      }
      // If one has a null rating, prioritize the one with a non-null rating
      if (a.averageRating === null) {
        return 1;
      }
      if (b.averageRating === null) {
        return -1;
      }
      // Sort by average rating in descending order
      return b.averageRating - a.averageRating;
    });

    return recommendations;
  }
}
