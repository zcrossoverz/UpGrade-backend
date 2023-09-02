import { Module } from '@nestjs/common';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRepository } from './course.repository';
import { Course } from '../entities/course.entity';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([Course])],
  providers: [CourseRepository],
  exports: [CourseRepository],
})
export class RepositoriesModule {}
