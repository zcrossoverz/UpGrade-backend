import { Module } from '@nestjs/common';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { CourseController } from './course/course.controller';
import { CategoryController } from './category/category.controller';
import { UnitController } from './unit/unit.controller';
import { TopicController } from './topic/topic.controller';
import { ApprovalRequestController } from './approval/approval.controller';
import { NotificationController } from './notification/notification.controller';
import { ReviewController } from './review/review.controller';
import { NoteController } from './note/note.controller';
import { CommentController } from './comment/comment.controller';
import { AnalyticsController } from './analytics/analytics.controller';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [
    CourseController,
    CategoryController,
    UnitController,
    TopicController,
    ApprovalRequestController,
    NotificationController,
    ReviewController,
    NoteController,
    CommentController,
    AnalyticsController,
  ],
})
export class ControllersModule {}
