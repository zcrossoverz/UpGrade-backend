import { Injectable, Inject } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { COURSE_MESSAGE_PATTERNS } from './messagePattern';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CourseService {
  constructor(@Inject('COURSE_SERVICE') private readonly client: ClientProxy) {}

  create(createCourseDto: CreateCourseDto) {
    return this.client.send(COURSE_MESSAGE_PATTERNS.create, createCourseDto);
  }

  getList() {
    return this.client.send(COURSE_MESSAGE_PATTERNS.getList, {});
  }

  findOne(id: number) {
    return this.client.send(COURSE_MESSAGE_PATTERNS.getOne, { id });
  }
}
