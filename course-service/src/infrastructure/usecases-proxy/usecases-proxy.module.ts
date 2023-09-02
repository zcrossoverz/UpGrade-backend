import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { LoggerService } from '../logger/logger.service';
import { CourseRepository } from '../repositories/course.repository';
import { GetCourseUseCase } from 'src/usecases/course/getCourse.usecases';
import { GetListCoursesUseCase } from 'src/usecases/course/getListCourses.usecases';
import { CreateDraftCourseUseCases } from 'src/usecases/course/createDraftCourse.usecases';

export class UseCaseProxy<T> {
  constructor(private readonly useCase: T) {}
  getInstance(): T {
    return this.useCase;
  }
}

@Module({
  imports: [LoggerModule, RepositoriesModule, ExceptionsModule],
})
export class UsecasesProxyModule {
  static GET_COURSE_USECASES_PROXY = 'getCourseUsecasesProxy';
  static GET_LIST_COURSE_USECASES_PROXY = 'getListCourseUsecasesProxy';
  static CREATE_COURSE_USECASES_PROXY = 'postCourseUsecasesProxy';
  static DELETE_COURSE_USECASES_PROXY = 'deleteCourseUsecasesProxy';
  static UPDATE_COURSE_USER_USECASES_PROXY = 'putCourseUsecasesProxy';

  static USE_CASE_PROXY_MAP = [
    {
      inject: [LoggerService, CourseRepository],
      provide: UsecasesProxyModule.GET_COURSE_USECASES_PROXY,
      useFactory: (logger: LoggerService, courseRepository: CourseRepository) =>
        new UseCaseProxy(new GetCourseUseCase(logger, courseRepository)),
    },
    {
      inject: [LoggerService, CourseRepository],
      provide: UsecasesProxyModule.GET_LIST_COURSE_USECASES_PROXY,
      useFactory: (logger: LoggerService, courseRepository: CourseRepository) =>
        new UseCaseProxy(new GetListCoursesUseCase(logger, courseRepository)),
    },
    {
      inject: [LoggerService, CourseRepository],
      provide: UsecasesProxyModule.CREATE_COURSE_USECASES_PROXY,
      useFactory: (logger: LoggerService, courseRepository: CourseRepository) =>
        new UseCaseProxy(
          new CreateDraftCourseUseCases(logger, courseRepository),
        ),
    },
  ];

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: UsecasesProxyModule.USE_CASE_PROXY_MAP,
      exports: [
        ...UsecasesProxyModule.USE_CASE_PROXY_MAP.map(
          (provider) => provider.provide,
        ),
      ],
    };
  }
}
