import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //const now = Date.now();
    const request = context.getArgByIndex(0);

    this.logger.log('test ', `${JSON.stringify(request)}`);

    //const ip = this.getIP(request);
    // this.logger.log(
    //   `Incoming Request on ${request.path}`,
    //   `method=${request.method} ip=${ip}`,
    // );

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `End Request for ${request}`,
          // `method=${request.method} ip=${ip} duration=${Date.now() - now}ms`,
          'aaaa',
        );
      }),
    );
  }
  private getIP(request: any): string {
    let ip: string;
    const ipAddr = request.headers['x-forwarded-for'];
    if (ipAddr) {
      const list = ipAddr.split(',');
      ip = list[list.length - 1];
    } else {
      ip = request.connection.remoteAddress;
    }
    return ip.replace('::ffff:', '');
  }
}
