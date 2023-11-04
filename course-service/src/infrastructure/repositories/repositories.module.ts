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

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([Course, Category, Unit, Topic]),
  ],
  providers: [
    CourseRepository,
    CategoryRepository,
    UnitRepository,
    TopicRepository,
  ],
  exports: [
    CourseRepository,
    CategoryRepository,
    UnitRepository,
    TopicRepository,
  ],
})
export class RepositoriesModule {}
