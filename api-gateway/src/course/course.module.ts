import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'COURSE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RBMQ_URI],
          queue: 'course_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RBMQ_URI],
          queue: 'auth_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService, AuthService],
})
export class CourseModule {}
