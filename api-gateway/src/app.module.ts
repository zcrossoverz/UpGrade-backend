import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LoggerModule } from './common/logger/logger.module';
import { CourseModule } from './course/course.module';
import { AuthModule } from './auth/auth.module';
import { GdriveModule } from './common/gdrive/gdrive.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    UserModule,
    LoggerModule,
    CourseModule,
    CategoryModule,
    AuthModule,
    GdriveModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
