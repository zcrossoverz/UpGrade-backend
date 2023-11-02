import { Module } from '@nestjs/common';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRepository } from './course.repository';
import { Course } from '../entities/course.entity';
import { CategoryRepository } from './category.repository';
import { Category } from '../entities/category.entity';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([Course, Category])],
  providers: [CourseRepository, CategoryRepository],
  exports: [CourseRepository, CategoryRepository],
})
export class RepositoriesModule {}
