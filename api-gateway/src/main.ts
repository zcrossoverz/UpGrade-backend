import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { LoggerService } from './common/logger/logger.service';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionFilter } from './common/exceptions/exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.useGlobalInterceptors(new ResponseInterceptor());

  // exception
  app.useGlobalFilters(new AllExceptionFilter());

  // enable cors
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
