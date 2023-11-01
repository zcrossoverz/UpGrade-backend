import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICourseRepository } from 'src/domain/repositories/courseRepository.interface';
import { CourseM, typeStatusCourse } from 'src/domain/model/course';
import { Course } from '../entities/course.entity';

@Injectable()
export class CourseRepository implements ICourseRepository {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(
    title: string,
    instructor_id: number,
    description: string,
    thumbnail_url: string,
  ): Promise<CourseM> {
    const result = await this.courseRepository.save(
      this.courseRepository.create({
        title,
        instructor_id,
        description: description,
        price: 0,
        thumbnail_url: thumbnail_url,
        status: typeStatusCourse.DRAFT,
      }),
    );
    return result;
  }
  async getCourse(id: number): Promise<CourseM> {
    const result = await this.courseRepository.findOneBy({ id });
    return result;
  }

  async getList(): Promise<{ datas: CourseM[]; count: number }> {
    const [datas, count] = await this.courseRepository.findAndCount({});
    return {
      datas,
      count,
    };
  }
}
