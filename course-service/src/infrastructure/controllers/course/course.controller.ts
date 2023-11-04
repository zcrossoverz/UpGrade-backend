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
import { UploadVideoCoursesUseCase } from 'src/usecases/course/uploadVideo.usecases';
import { COURSE_MESSAGE_PATTERNS } from './messagePattern';
import { GetMyCoursesUseCase } from 'src/usecases/course/getMyCourses';

@Controller('course')
export class CourseController {
  constructor(
    @Inject(UsecasesProxyModule.CREATE_COURSE_USECASES_PROXY)
    private readonly createCourseUsecasesProxy: UseCaseProxy<CreateDraftCourseUseCases>,
    @Inject(UsecasesProxyModule.GET_COURSE_USECASES_PROXY)
    private readonly getCourseUsecasesProxy: UseCaseProxy<GetCourseUseCase>,
    @Inject(UsecasesProxyModule.GET_LIST_COURSE_USECASES_PROXY)
    private readonly getListCourseUsecasesProxy: UseCaseProxy<GetListCoursesUseCase>,
    @Inject(UsecasesProxyModule.POST_UPLOADVIDEO_USECASES_PROXY)
    private readonly uploadVideoUsecaseProxy: UseCaseProxy<UploadVideoCoursesUseCase>,
    @Inject(UsecasesProxyModule.GET_MY_COURSES_USECASES_PROXY)
    private readonly getMyCoursesUsecaseProxy: UseCaseProxy<GetMyCoursesUseCase>,
  ) {}

  @MessagePattern(COURSE_MESSAGE_PATTERNS.create)
  async createCourse(@Payload() createCourseDto: CreateCourseDto) {
    const { title, instructor_id, thumbnail, description, category } =
      createCourseDto;

    // console.log(thumbnail, trailer, title, instructor_id);

    const course = await this.createCourseUsecasesProxy
      .getInstance()
      .excute(title, instructor_id, description, thumbnail, category);
    return course;
  }

  @MessagePattern(COURSE_MESSAGE_PATTERNS.getOne)
  async getCourse(@Payload('id', ParseIntPipe) id: number) {
    const course = await this.getCourseUsecasesProxy.getInstance().excute(id);
    return course;
  }

  @MessagePattern(COURSE_MESSAGE_PATTERNS.getList)
  async getListCourse() {
    const result = await this.getListCourseUsecasesProxy.getInstance().excute();
    return result;
  }

  @MessagePattern(COURSE_MESSAGE_PATTERNS.uploadVideo)
  async uploadVideo() {
    const result = await this.uploadVideoUsecaseProxy.getInstance().excute();
    return result;
  }

  @MessagePattern(COURSE_MESSAGE_PATTERNS.getMyCourses)
  async getMyCourses(
    @Payload('instructor_id', ParseIntPipe) instructor_id: number,
  ) {
    const result = await this.getMyCoursesUsecaseProxy
      .getInstance()
      .excute(instructor_id);
    return result;
  }
}
