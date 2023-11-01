import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { LoggerService } from '../logger/logger.service';
import { CourseRepository } from '../repositories/course.repository';
import { GetCourseUseCase } from 'src/usecases/course/getCourse.usecases';
import { GetListCoursesUseCase } from 'src/usecases/course/getListCourses.usecases';
import { CreateDraftCourseUseCases } from 'src/usecases/course/createDraftCourse.usecases';
import { UploadVideoCoursesUseCase } from 'src/usecases/course/uploadVideo.usecases';
import { GdriveModule } from '../libs/gdrive/gdrive.module';
import { GDrive } from '../libs/gdrive/gdrive';

export class UseCaseProxy<T> {
  constructor(private readonly useCase: T) {}
  getInstance(): T {
    return this.useCase;
  }
}

@Module({
  imports: [LoggerModule, RepositoriesModule, ExceptionsModule, GdriveModule],
})
export class UsecasesProxyModule {
  static GET_COURSE_USECASES_PROXY = 'getCourseUsecasesProxy';
  static GET_LIST_COURSE_USECASES_PROXY = 'getListCourseUsecasesProxy';
  static CREATE_COURSE_USECASES_PROXY = 'postCourseUsecasesProxy';
  static DELETE_COURSE_USECASES_PROXY = 'deleteCourseUsecasesProxy';
  static UPDATE_COURSE_USER_USECASES_PROXY = 'putCourseUsecasesProxy';
  static POST_UPLOADVIDEO_USECASES_PROXY = 'postUploadVideoUsecasesProxy';

  static USE_CASE_PROXY_MAP: {
    provide: string;
    useFactory: any;
    inject: any[];
  }[] = [
    {
      provide: UsecasesProxyModule.GET_COURSE_USECASES_PROXY,
      useFactory: (logger: LoggerService, courseRepository: CourseRepository) =>
        new UseCaseProxy(new GetCourseUseCase(logger, courseRepository)),
      inject: [LoggerService, CourseRepository],
    },
    {
      provide: UsecasesProxyModule.GET_LIST_COURSE_USECASES_PROXY,
      useFactory: (logger: LoggerService, courseRepository: CourseRepository) =>
        new UseCaseProxy(new GetListCoursesUseCase(logger, courseRepository)),
      inject: [LoggerService, CourseRepository],
    },
    {
      provide: UsecasesProxyModule.CREATE_COURSE_USECASES_PROXY,
      useFactory: (logger: LoggerService, courseRepository: CourseRepository) =>
        new UseCaseProxy(
          new CreateDraftCourseUseCases(logger, courseRepository),
        ),
      inject: [LoggerService, CourseRepository],
    },
    {
      provide: UsecasesProxyModule.POST_UPLOADVIDEO_USECASES_PROXY,
      useFactory: (
        logger: LoggerService,
        courseRepository: CourseRepository,
        gdrive: GDrive,
      ) =>
        new UseCaseProxy(
          new UploadVideoCoursesUseCase(logger, courseRepository, gdrive),
        ),
      inject: [LoggerService, CourseRepository, GDrive],
    },
  ];

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: UsecasesProxyModule.USE_CASE_PROXY_MAP,
      exports: [
        ...UsecasesProxyModule.USE_CASE_PROXY_MAP.map(({ provide }) => provide),
      ],
    };
  }
}
