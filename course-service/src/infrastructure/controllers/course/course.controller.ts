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
import { DeleteCourseUseCase } from 'src/usecases/course/deleteCourse';
import { UpdateCoursesUseCase } from 'src/usecases/course/updateCourse';
import { EnrollCourseUseCase } from 'src/usecases/course/enroll';
import { GetLibraryUseCase } from 'src/usecases/course/getLibrary.usecases';
import { GetRecommendCourseUseCase } from 'src/usecases/course/getRecommendCourse.usecases';

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
    @Inject(UsecasesProxyModule.DELETE_COURSE_USECASES_PROXY)
    private readonly deleteCoursesUsecaseProxy: UseCaseProxy<DeleteCourseUseCase>,
    @Inject(UsecasesProxyModule.UPDATE_COURSE_USER_USECASES_PROXY)
    private readonly updateCoursesUsecaseProxy: UseCaseProxy<UpdateCoursesUseCase>,
    @Inject(UsecasesProxyModule.ENROLL_COURSES_USECASES_PROXY)
    private readonly enrollCoursesUsecaseProxy: UseCaseProxy<EnrollCourseUseCase>,
    @Inject(UsecasesProxyModule.GET_LIBRARY_USECASES_PROXY)
    private readonly getLibraryUsecasesProxy: UseCaseProxy<GetLibraryUseCase>,
    @Inject(UsecasesProxyModule.GET_RECOMMEND_COURSES_USECASES_PROXY)
    private readonly getRecommend: UseCaseProxy<GetRecommendCourseUseCase>,
  ) {}

  @MessagePattern(COURSE_MESSAGE_PATTERNS.create)
  async createCourse(@Payload() createCourseDto: CreateCourseDto) {
    const {
      title,
      instructor_id,
      thumbnail,
      description,
      category,
      drive_folder_id,
      instructor_fullname,
    } = createCourseDto;

    const course = await this.createCourseUsecasesProxy
      .getInstance()
      .excute(
        title,
        instructor_id,
        description,
        thumbnail,
        category,
        drive_folder_id,
        instructor_fullname,
      );
    return course;
  }

  @MessagePattern(COURSE_MESSAGE_PATTERNS.getOne)
  async getCourse(@Payload('id', ParseIntPipe) id: number) {
    const course = await this.getCourseUsecasesProxy.getInstance().excute(id);
    return course;
  }

  @MessagePattern(COURSE_MESSAGE_PATTERNS.getList)
  async getListCourse(@Payload() filter) {
    const result = await this.getListCourseUsecasesProxy
      .getInstance()
      .excute(filter);
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

  @MessagePattern(COURSE_MESSAGE_PATTERNS.delete)
  async deleteCourses(@Payload('course_id', ParseIntPipe) course_id: number) {
    const result = await this.deleteCoursesUsecaseProxy
      .getInstance()
      .excute(course_id);
    return result;
  }

  @MessagePattern(COURSE_MESSAGE_PATTERNS.update)
  async updateCourse(
    @Payload()
    data: any,
  ) {
    const result = await this.updateCoursesUsecaseProxy
      .getInstance()
      .excute(data.course_id, { ...data.data });
    return result;
  }

  @MessagePattern(COURSE_MESSAGE_PATTERNS.enroll)
  async enrollCourse(
    @Payload()
    data: {
      course_id: number;
      user_id: number;
      user_fullname: string;
    },
  ) {
    const result = await this.enrollCoursesUsecaseProxy
      .getInstance()
      .excute(data.course_id, data.user_id, data.user_fullname);
    return result;
  }

  @MessagePattern(COURSE_MESSAGE_PATTERNS.getLibrary)
  async getLibrary(
    @Payload()
    data: {
      user_id: number;
    },
  ) {
    const result = await this.getLibraryUsecasesProxy
      .getInstance()
      .excute(data.user_id);
    return result;
  }

  @MessagePattern(COURSE_MESSAGE_PATTERNS.getRecommend)
  async getRecommendCourse(
    @Payload()
    data: {
      user_id: number;
    },
  ) {
    const result = await this.getRecommend.getInstance().excute(data.user_id);
    return result;
  }
}
