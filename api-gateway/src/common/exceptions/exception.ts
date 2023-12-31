import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = (exception.status || 500) > 500 ? 500 : exception.status;

    response.status(status).json({
      statusCode: status,
      message:
        exception.response?.information?.message ||
        exception.response?.information?.detail ||
        exception.response?.message,
      detail: exception.response,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
