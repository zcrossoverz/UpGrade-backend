import { Module } from '@nestjs/common';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRepository } from './course.repository';
import { Course } from '../entities/course.entity';
import { CategoryRepository } from './category.repository';
import { Category } from '../entities/category.entity';
import { Unit } from '../entities/unit.entity';
import { Topic } from '../entities/topic.entity';
import { UnitRepository } from './unit.repository';
import { TopicRepository } from './topic.repository';
import { ApprovalRequestRepository } from './approvalRequest.repository';
import { ApprovalRequest } from '../entities/approvalRequest.entity';
import { CourseProgressRepository } from './courseProgress.repository';
import { CourseProgress } from '../entities/courseProgress.entity';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([
      Course,
      Category,
      Unit,
      Topic,
      ApprovalRequest,
      CourseProgress,
    ]),
  ],
  providers: [
    CourseRepository,
    CategoryRepository,
    UnitRepository,
    TopicRepository,
    ApprovalRequestRepository,
    CourseProgressRepository,
  ],
  exports: [
    CourseRepository,
    CategoryRepository,
    UnitRepository,
    TopicRepository,
    ApprovalRequestRepository,
    CourseProgressRepository,
  ],
})
export class RepositoriesModule {}
