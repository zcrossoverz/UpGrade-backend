import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from 'src/auth/auth.service';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'COMMENT_SERVICE',
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
  controllers: [CommentController],
  providers: [CommentService, AuthService],
})
export class CommentModule {}
