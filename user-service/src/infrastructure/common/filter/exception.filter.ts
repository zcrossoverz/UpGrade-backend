import {
  ArgumentsHost,
  Catch,
  HttpException,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import * as Flatted from 'flatted';

interface IError {
  message: any;
  code_error: number;
}

@Catch()
export class AllExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    const error: IError = {
      message: '',
      code_error: 500,
    };
    if ('driverError' in exception) {
      error.message = exception.driverError || '';
      error.code_error = exception.code || 500;
    } else {
      error.message = exception.error?.response || {};
      error.code_error = exception.error?.status || 500;
    }

    const context = JSON.parse(
      Flatted.stringify(host.switchToRpc().getContext()),
    );

    // get pattern message from context
    const patternMessage = JSON.parse(
      context.find((e) => typeof e === 'string'),
    );

    const payload = host.switchToRpc().getData();

    return throwError(
      () =>
        new HttpException(
          {
            information: error.message,
            payload,
            patternMessage,
          },
          error.code_error,
        ),
    );
  }
}
