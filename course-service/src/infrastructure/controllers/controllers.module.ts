import { Module } from '@nestjs/common';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { CourseController } from './course/course.controller';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [CourseController],
})
export class ControllersModule {}
