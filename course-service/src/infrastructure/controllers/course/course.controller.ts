import { Controller, Inject, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  UseCaseProxy,
  UsecasesProxyModule,
} from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { CreateDraftCourseUseCases } from 'src/usecases/course/createDraftCourse.usecases';
import { GetCourseUseCase } from 'src/usecases/course/getCourse.usecases';
import { CreateCourseDto } from './course.dto';
import { GetListCoursesUseCase } from 'src/usecases/course/getListCourses.usecases';

@Controller('course')
export class CourseController {
  constructor(
    @Inject(UsecasesProxyModule.CREATE_COURSE_USECASES_PROXY)
    private readonly createCourseUsecasesProxy: UseCaseProxy<CreateDraftCourseUseCases>,
    @Inject(UsecasesProxyModule.GET_COURSE_USECASES_PROXY)
    private readonly getCourseUsecasesProxy: UseCaseProxy<GetCourseUseCase>,
    @Inject(UsecasesProxyModule.GET_LIST_COURSE_USECASES_PROXY)
    private readonly getListCourseUsecasesProxy: UseCaseProxy<GetListCoursesUseCase>,
  ) {}

  @MessagePattern({
    prefix: 'course',
    action: 'create',
  })
  async createCourse(@Payload() createCourseDto: CreateCourseDto) {
    const { title, instructor_id } = createCourseDto;
    const course = await this.createCourseUsecasesProxy
      .getInstance()
      .excute(title, instructor_id);
    return course;
  }

  @MessagePattern({
    prefix: 'course',
    action: 'get-one',
  })
  async getCourse(@Payload('id', ParseIntPipe) id: number) {
    const course = await this.getCourseUsecasesProxy.getInstance().excute(id);
    return course;
  }

  @MessagePattern({
    prefix: 'course',
    action: 'get-list',
  })
  async getListCourse() {
    const result = await this.getListCourseUsecasesProxy.getInstance().excute();
    return result;
  }
}
