import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICourseRepository } from 'src/domain/repositories/courseRepository.interface';
import { CourseM, typeStatusCourse } from 'src/domain/model/course';
import { Course } from '../entities/course.entity';
import { Category } from '../entities/category.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CourseRepository implements ICourseRepository {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    title: string,
    instructor_id: number,
    description: string,
    thumbnail_url: string,
    category: number,
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
    });
    return result;
  }

  async getList(): Promise<{ datas: CourseM[]; count: number }> {
    const [datas, count] = await this.courseRepository.findAndCount({});
    return {
      datas,
      count,
    };
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
}
