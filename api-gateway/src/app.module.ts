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
import { UnitModule } from './unit/unit.module';
import { TopicModule } from './topic/topic.module';
import { NotificationModule } from './notification/notification.module';
import { ReviewModule } from './review/review.module';
import { NoteModule } from './note/note.module';
import { CommentModule } from './comment/comment.module';
import { AnalysticModule } from './analytics/analytics.module';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [
    UserModule,
    LoggerModule,
    CourseModule,
    CategoryModule,
    AuthModule,
    GdriveModule,
    UnitModule,
    NotificationModule,
    TopicModule,
    ReviewModule,
    NoteModule,
    CommentModule,
    AnalysticModule,
    ProxyModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
