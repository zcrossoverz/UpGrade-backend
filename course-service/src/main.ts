import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './infrastructure/common/filter/exception.filter';
//import { LoggingInterceptor } from './infrastructure/common/interceptors/logger.interceptor';
//import { ResponseInterceptor } from './infrastructure/common/interceptors/response.interceptor';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          'amqps://rzbyzkfk:XccWKAMlyqVb5XxyUsPGO0lNFFJCKpdt@armadillo.rmq.cloudamqp.com/rzbyzkfk',
        ],
        queue: 'course_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  // filters
  app.useGlobalFilters(new AllExceptionFilter());

  // interceptors
  //app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  //app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen();
}
bootstrap();
