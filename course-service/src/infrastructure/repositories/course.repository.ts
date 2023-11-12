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
