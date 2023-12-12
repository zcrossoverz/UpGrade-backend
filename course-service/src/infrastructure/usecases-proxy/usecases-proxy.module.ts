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
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryUseCases } from 'src/usecases/category/createCategory';
import { UpdateCategoryUseCases } from 'src/usecases/category/updateCategory';
import { GetListCategoryUseCases } from 'src/usecases/category/getListCategory';
import { DeleteCategoryUseCases } from 'src/usecases/category/deleteCategory';
import { GetMyCoursesUseCase } from 'src/usecases/course/getMyCourses';
import { UnitRepository } from '../repositories/unit.repository';
import { CreateUnitUseCase } from 'src/usecases/unit/createUnit';
import { UpdateUnitUseCase } from 'src/usecases/unit/updateUnit';
import { DeleteUnitUseCase } from 'src/usecases/unit/deleteUnit';
import { TopicRepository } from '../repositories/topic.repository';
import { CreateTopicUseCase } from 'src/usecases/topic/createTopic';
import { GetTopicUseCase } from 'src/usecases/topic/getTopic';
import { GetListTopicUseCase } from 'src/usecases/topic/getListTopic';
import { UpdateTopicUseCase } from 'src/usecases/topic/updateTopic';
import { DeleteTopicUseCase } from 'src/usecases/topic/deleteTopic';
import { ApprovalRequestRepository } from '../repositories/approvalRequest.repository';
import { SubmitApprovalUseCases } from 'src/usecases/approvalRequest/submitApproval';
import { ProcessApprovalUseCases } from 'src/usecases/approvalRequest/approvalProcess';
import { GetListApprovalUseCases } from 'src/usecases/approvalRequest/getList';
import { DeleteCourseUseCase } from 'src/usecases/course/deleteCourse';
import { UpdateCoursesUseCase } from 'src/usecases/course/updateCourse';
import { EnrollCourseUseCase } from 'src/usecases/course/enroll';
import { CourseProgressRepository } from '../repositories/courseProgress.repository';
import { LibraryRepository } from '../repositories/library.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { GetLibraryUseCase } from 'src/usecases/course/getLibrary.usecases';
import { GetUnreadNotiListUseCases } from 'src/usecases/notification/getListUnread';
import { MarkReadNotiUseCases } from 'src/usecases/notification/markRead';
import { CreateReviewUseCase } from 'src/usecases/review/create';
import { ReviewRepository } from '../repositories/review.repository';
import { UpdateReviewUseCase } from 'src/usecases/review/update';
import { DeleteReviewUseCase } from 'src/usecases/review/delete';
import { GetListReviewUseCase } from 'src/usecases/review/getList';
import { CreateNoteUseCase } from 'src/usecases/note/add';
import { NoteRepository } from '../repositories/note.repository';
import { GetListNoteUseCase } from 'src/usecases/note/getList';
import { DeleteNoteUseCase } from 'src/usecases/note/delete';
import { CommentRepository } from '../repositories/comment.repository';
import { CreateCommentUseCase } from 'src/usecases/comment/create';
import { UpdateCommentUseCase } from 'src/usecases/comment/update';
import { GetListCommentUseCase } from 'src/usecases/comment/getList';
import { DeleteCommentUseCase } from 'src/usecases/comment/delete';
import { ReactCommentUseCase } from 'src/usecases/comment/react';
import { AnalystCategoryUseCases } from 'src/usecases/category/analytic';
import { ChatGpt } from '../libs/chatgpt/chatgpt';
import { ChatGptModule } from '../libs/chatgpt/chatgpt.module';
import { AnalyticRepository } from '../repositories/analytics.repository';
import { GetOverviewAnalystic } from 'src/usecases/analytics/courseAnalystic';
import { GetRecommendCourseUseCase } from 'src/usecases/course/getRecommendCourse.usecases';

export class UseCaseProxy<T> {
  constructor(private readonly useCase: T) {}
  getInstance(): T {
    return this.useCase;
  }
}

@Module({
  imports: [
    LoggerModule,
    RepositoriesModule,
    ExceptionsModule,
    GdriveModule,
    ChatGptModule,
  ],
})
export class UsecasesProxyModule {
  // course
  static GET_COURSE_USECASES_PROXY = 'getCourseUsecasesProxy';
  static GET_LIST_COURSE_USECASES_PROXY = 'getListCourseUsecasesProxy';
  static CREATE_COURSE_USECASES_PROXY = 'postCourseUsecasesProxy';
  static DELETE_COURSE_USECASES_PROXY = 'deleteCourseUsecasesProxy';
  static UPDATE_COURSE_USER_USECASES_PROXY = 'putCourseUsecasesProxy';
  static POST_UPLOADVIDEO_USECASES_PROXY = 'postUploadVideoUsecasesProxy';
  static GET_MY_COURSES_USECASES_PROXY = 'getMyCourseUsecasesProxy';
  static ENROLL_COURSES_USECASES_PROXY = 'enrollCourseUsecasesProxy';
  static GET_LIBRARY_USECASES_PROXY = 'getLibraryUsecasesProxy';
  static GET_RECOMMEND_COURSES_USECASES_PROXY =
    'getRecommendCourseUsecasesProxy';

  // category
  static GET_LIST_CATEGORY_USECASES_PROXY = 'getListCategoryUsecasesProxy';
  static CREATE_CATEGORY_USECASES_PROXY = 'postCategoryUsecasesProxy';
  static DELETE_CATEGORY_USECASES_PROXY = 'deleteCategoryUsecasesProxy';
  static UPDATE_CATEGORY_USER_USECASES_PROXY = 'putCategoryUsecasesProxy';
  static GET_ANALIST_CATEGORY_USECASES_PROXY =
    'getAnalistCategoryUsecasesProxy';

  // units
  static CREATE_UNIT_USECASES_PROXY = 'createUnitUsecasesProxy';
  static UPDATE_UNIT_USECASES_PROXY = 'updateUnitUsecasesProxy';
  static DELETE_UNIT_USECASES_PROXY = 'deleteUnitUsecasesProxy';

  // topics
  static CREATE_TOPIC_USECASES_PROXY = 'createTopicUsecasesProxy';
  static UPDATE_TOPIC_USECASES_PROXY = 'updateTopicUsecasesProxy';
  static GET_TOPIC_USECASES_PROXY = 'getTopicUsecasesProxy';
  static GETLIST_TOPIC_USECASES_PROXY = 'getListTopicUsecasesProxy';
  static DELETE_TOPIC_USECASES_PROXY = 'deleteTopicUsecasesProxy';

  // approval request
  static GET_LIST_APPROVAL_REQUEST_USECASES_PROXY =
    'getListApprovalRequestUsecasesProxy';
  static CREATE_APPROVAL_REQUEST_USECASES_PROXY =
    'postApprovalRequestUsecasesProxy';
  static PROCESS_APPROVAL_REQUEST_USECASES_PROXY =
    'processApprovalRequestUsecasesProxy';

  // notifications

  static GET_LIST_UNREAD_NOTIFICATIONS_USECASES_PROXY =
    'getListUnreadNotificationsUsecasesProxy';
  static MARK_READ_NOTIFICATIONS_USECASES_PROXY =
    'markReadNotificationsUsecasesProxy';

  // review

  static CREATE_REVIEW_USECASES_PROXY = 'createReviewUsecasesProxy';
  static UPDATE_REVIEW_USECASES_PROXY = 'updateReviewUsecasesProxy';
  static DELETE_REVIEW_USECASES_PROXY = 'deleteReviewUsecasesProxy';
  static GETLIST_REVIEW_USECASES_PROXY = 'getListReviewUsecasesProxy';

  // note
  static ADD_NOTE_USECASES_PROXY = 'addNoteUsecasesProxy';
  static GETLIST_NOTE_USECASES_PROXY = 'getListNoteUsecasesProxy';
  static DELETE_NOTE_USECASES_PROXY = 'deleteNoteUsecasesProxy';

  // comment
  static CREATE_COMMENT_USECASES_PROXY = 'createCommentUsecasesProxy';
  static UPDATE_COMMENT_USECASES_PROXY = 'updateCommentUsecasesProxy';
  static GETLIST_COMMENT_USECASES_PROXY = 'getListCommentUsecasesProxy';
  static REACT_COMMENT_USECASES_PROXY = 'reactCommentUsecasesProxy';
  static DELETE_COMMENT_USECASES_PROXY = 'deleteCommentUsecasesProxy';

  // analytics
  static GET_OVERVIEW_ANALYTICS_USECASES_PROXY = 'getAnalyticsUsecasesProxy';

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

    {
      provide: UsecasesProxyModule.GET_MY_COURSES_USECASES_PROXY,
      useFactory: (logger: LoggerService, courseRepository: CourseRepository) =>
        new UseCaseProxy(new GetMyCoursesUseCase(logger, courseRepository)),
      inject: [LoggerService, CourseRepository],
    },
    {
      provide: UsecasesProxyModule.GET_RECOMMEND_COURSES_USECASES_PROXY,
      useFactory: (logger: LoggerService, courseRepository: CourseRepository) =>
        new UseCaseProxy(
          new GetRecommendCourseUseCase(logger, courseRepository),
        ),
      inject: [LoggerService, CourseRepository],
    },
    {
      provide: UsecasesProxyModule.DELETE_COURSE_USECASES_PROXY,
      useFactory: (logger: LoggerService, courseRepository: CourseRepository) =>
        new UseCaseProxy(new DeleteCourseUseCase(logger, courseRepository)),
      inject: [LoggerService, CourseRepository],
    },
    {
      provide: UsecasesProxyModule.UPDATE_COURSE_USER_USECASES_PROXY,
      useFactory: (logger: LoggerService, courseRepository: CourseRepository) =>
        new UseCaseProxy(new UpdateCoursesUseCase(logger, courseRepository)),
      inject: [LoggerService, CourseRepository],
    },
    {
      provide: UsecasesProxyModule.ENROLL_COURSES_USECASES_PROXY,
      useFactory: (
        logger: LoggerService,
        courseRepository: CourseRepository,
        courseProgressRepository: CourseProgressRepository,
        libraryRepository: LibraryRepository,
        notificationRepository: NotificationRepository,
      ) =>
        new UseCaseProxy(
          new EnrollCourseUseCase(
            logger,
            courseRepository,
            courseProgressRepository,
            libraryRepository,
            notificationRepository,
          ),
        ),
      inject: [
        LoggerService,
        CourseRepository,
        CourseProgressRepository,
        LibraryRepository,
        NotificationRepository,
      ],
    },
    {
      provide: UsecasesProxyModule.GET_LIBRARY_USECASES_PROXY,
      useFactory: (
        logger: LoggerService,
        libraryRepository: LibraryRepository,
      ) => new UseCaseProxy(new GetLibraryUseCase(logger, libraryRepository)),
      inject: [LoggerService, LibraryRepository],
    },

    // category
    {
      provide: UsecasesProxyModule.CREATE_CATEGORY_USECASES_PROXY,
      useFactory: (
        logger: LoggerService,
        categoryRepository: CategoryRepository,
      ) =>
        new UseCaseProxy(
          new CreateCategoryUseCases(logger, categoryRepository),
        ),
      inject: [LoggerService, CategoryRepository],
    },
    {
      provide: UsecasesProxyModule.UPDATE_CATEGORY_USER_USECASES_PROXY,
      useFactory: (
        logger: LoggerService,
        categoryRepository: CategoryRepository,
      ) =>
        new UseCaseProxy(
          new UpdateCategoryUseCases(logger, categoryRepository),
        ),
      inject: [LoggerService, CategoryRepository],
    },
    {
      provide: UsecasesProxyModule.DELETE_CATEGORY_USECASES_PROXY,
      useFactory: (
        logger: LoggerService,
        categoryRepository: CategoryRepository,
      ) =>
        new UseCaseProxy(
          new DeleteCategoryUseCases(logger, categoryRepository),
        ),
      inject: [LoggerService, CategoryRepository],
    },
    {
      provide: UsecasesProxyModule.GET_LIST_CATEGORY_USECASES_PROXY,
      useFactory: (
        logger: LoggerService,
        categoryRepository: CategoryRepository,
      ) =>
        new UseCaseProxy(
          new GetListCategoryUseCases(logger, categoryRepository),
        ),
      inject: [LoggerService, CategoryRepository],
    },
    {
      provide: UsecasesProxyModule.GET_ANALIST_CATEGORY_USECASES_PROXY,
      useFactory: (
        logger: LoggerService,
        categoryRepository: CategoryRepository,
      ) =>
        new UseCaseProxy(
          new AnalystCategoryUseCases(logger, categoryRepository),
        ),
      inject: [LoggerService, CategoryRepository],
    },

    // units
    {
      provide: UsecasesProxyModule.CREATE_UNIT_USECASES_PROXY,
      useFactory: (logger: LoggerService, unitRepository: UnitRepository) =>
        new UseCaseProxy(new CreateUnitUseCase(logger, unitRepository)),
      inject: [LoggerService, UnitRepository],
    },
    {
      provide: UsecasesProxyModule.UPDATE_UNIT_USECASES_PROXY,
      useFactory: (logger: LoggerService, unitRepository: UnitRepository) =>
        new UseCaseProxy(new UpdateUnitUseCase(logger, unitRepository)),
      inject: [LoggerService, UnitRepository],
    },
    {
      provide: UsecasesProxyModule.DELETE_UNIT_USECASES_PROXY,
      useFactory: (logger: LoggerService, unitRepository: UnitRepository) =>
        new UseCaseProxy(new DeleteUnitUseCase(logger, unitRepository)),
      inject: [LoggerService, UnitRepository],
    },

    // topics
    {
      provide: UsecasesProxyModule.CREATE_TOPIC_USECASES_PROXY,

      useFactory: (logger: LoggerService, topicRepository: TopicRepository) =>
        new UseCaseProxy(new CreateTopicUseCase(logger, topicRepository)),
      inject: [LoggerService, TopicRepository],
    },
    {
      provide: UsecasesProxyModule.GET_TOPIC_USECASES_PROXY,
      useFactory: (logger: LoggerService, topicRepository: TopicRepository) =>
        new UseCaseProxy(new GetTopicUseCase(logger, topicRepository)),
      inject: [LoggerService, TopicRepository],
    },
    {
      provide: UsecasesProxyModule.GETLIST_TOPIC_USECASES_PROXY,
      useFactory: (logger: LoggerService, topicRepository: TopicRepository) =>
        new UseCaseProxy(new GetListTopicUseCase(logger, topicRepository)),
      inject: [LoggerService, TopicRepository],
    },
    {
      provide: UsecasesProxyModule.UPDATE_TOPIC_USECASES_PROXY,
      useFactory: (logger: LoggerService, topicRepository: TopicRepository) =>
        new UseCaseProxy(new UpdateTopicUseCase(logger, topicRepository)),
      inject: [LoggerService, TopicRepository],
    },
    {
      provide: UsecasesProxyModule.DELETE_TOPIC_USECASES_PROXY,
      useFactory: (logger: LoggerService, topicRepository: TopicRepository) =>
        new UseCaseProxy(new DeleteTopicUseCase(logger, topicRepository)),
      inject: [LoggerService, TopicRepository],
    },

    // approval request

    {
      provide: UsecasesProxyModule.CREATE_APPROVAL_REQUEST_USECASES_PROXY,
      useFactory: (
        logger: LoggerService,
        repository: ApprovalRequestRepository,
      ) => new UseCaseProxy(new SubmitApprovalUseCases(logger, repository)),
      inject: [LoggerService, ApprovalRequestRepository],
    },
    {
      provide: UsecasesProxyModule.PROCESS_APPROVAL_REQUEST_USECASES_PROXY,
      useFactory: (
        logger: LoggerService,
        repository: ApprovalRequestRepository,
        noti: NotificationRepository,
      ) =>
        new UseCaseProxy(new ProcessApprovalUseCases(logger, repository, noti)),
      inject: [
        LoggerService,
        ApprovalRequestRepository,
        NotificationRepository,
      ],
    },
    {
      provide: UsecasesProxyModule.GET_LIST_APPROVAL_REQUEST_USECASES_PROXY,
      useFactory: (
        logger: LoggerService,
        repository: ApprovalRequestRepository,
      ) => new UseCaseProxy(new GetListApprovalUseCases(logger, repository)),
      inject: [LoggerService, ApprovalRequestRepository],
    },

    // notification

    {
      provide: UsecasesProxyModule.GET_LIST_UNREAD_NOTIFICATIONS_USECASES_PROXY,
      useFactory: (logger: LoggerService, repository: NotificationRepository) =>
        new UseCaseProxy(new GetUnreadNotiListUseCases(logger, repository)),
      inject: [LoggerService, NotificationRepository],
    },
    {
      provide: UsecasesProxyModule.MARK_READ_NOTIFICATIONS_USECASES_PROXY,
      useFactory: (logger: LoggerService, repository: NotificationRepository) =>
        new UseCaseProxy(new MarkReadNotiUseCases(logger, repository)),
      inject: [LoggerService, NotificationRepository],
    },

    // review
    {
      provide: UsecasesProxyModule.CREATE_REVIEW_USECASES_PROXY,
      useFactory: (logger: LoggerService, repository: ReviewRepository) =>
        new UseCaseProxy(new CreateReviewUseCase(logger, repository)),
      inject: [LoggerService, ReviewRepository],
    },
    {
      provide: UsecasesProxyModule.UPDATE_REVIEW_USECASES_PROXY,
      useFactory: (logger: LoggerService, repository: ReviewRepository) =>
        new UseCaseProxy(new UpdateReviewUseCase(logger, repository)),
      inject: [LoggerService, ReviewRepository],
    },
    {
      provide: UsecasesProxyModule.DELETE_REVIEW_USECASES_PROXY,
      useFactory: (logger: LoggerService, repository: ReviewRepository) =>
        new UseCaseProxy(new DeleteReviewUseCase(logger, repository)),
      inject: [LoggerService, ReviewRepository],
    },
    {
      provide: UsecasesProxyModule.GETLIST_REVIEW_USECASES_PROXY,
      useFactory: (logger: LoggerService, repository: ReviewRepository) =>
        new UseCaseProxy(new GetListReviewUseCase(logger, repository)),
      inject: [LoggerService, ReviewRepository],
    },

    // note
    {
      provide: UsecasesProxyModule.ADD_NOTE_USECASES_PROXY,
      useFactory: (logger: LoggerService, repository: NoteRepository) =>
        new UseCaseProxy(new CreateNoteUseCase(logger, repository)),
      inject: [LoggerService, NoteRepository],
    },
    {
      provide: UsecasesProxyModule.GETLIST_NOTE_USECASES_PROXY,
      useFactory: (logger: LoggerService, repository: NoteRepository) =>
        new UseCaseProxy(new GetListNoteUseCase(logger, repository)),
      inject: [LoggerService, NoteRepository],
    },
    {
      provide: UsecasesProxyModule.DELETE_NOTE_USECASES_PROXY,
      useFactory: (logger: LoggerService, repository: NoteRepository) =>
        new UseCaseProxy(new DeleteNoteUseCase(logger, repository)),
      inject: [LoggerService, NoteRepository],
    },

    // comment
    {
      provide: UsecasesProxyModule.CREATE_COMMENT_USECASES_PROXY,
      useFactory: (
        logger: LoggerService,
        repository: CommentRepository,
        chatGpt: ChatGpt,
      ) =>
        new UseCaseProxy(new CreateCommentUseCase(logger, repository, chatGpt)),
      inject: [LoggerService, CommentRepository, ChatGpt],
    },
    {
      provide: UsecasesProxyModule.UPDATE_COMMENT_USECASES_PROXY,
      useFactory: (logger: LoggerService, repository: CommentRepository) =>
        new UseCaseProxy(new UpdateCommentUseCase(logger, repository)),
      inject: [LoggerService, CommentRepository],
    },
    {
      provide: UsecasesProxyModule.GETLIST_COMMENT_USECASES_PROXY,
      useFactory: (logger: LoggerService, repository: CommentRepository) =>
        new UseCaseProxy(new GetListCommentUseCase(logger, repository)),
      inject: [LoggerService, CommentRepository],
    },
    {
      provide: UsecasesProxyModule.DELETE_COMMENT_USECASES_PROXY,
      useFactory: (logger: LoggerService, repository: CommentRepository) =>
        new UseCaseProxy(new DeleteCommentUseCase(logger, repository)),
      inject: [LoggerService, CommentRepository],
    },
    {
      provide: UsecasesProxyModule.REACT_COMMENT_USECASES_PROXY,
      useFactory: (logger: LoggerService, repository: CommentRepository) =>
        new UseCaseProxy(new ReactCommentUseCase(logger, repository)),
      inject: [LoggerService, CommentRepository],
    },

    // analytics
    {
      provide: UsecasesProxyModule.GET_OVERVIEW_ANALYTICS_USECASES_PROXY,
      useFactory: (logger: LoggerService, repository: AnalyticRepository) =>
        new UseCaseProxy(new GetOverviewAnalystic(logger, repository)),
      inject: [LoggerService, AnalyticRepository],
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
