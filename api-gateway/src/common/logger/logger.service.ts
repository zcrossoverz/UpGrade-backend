import { Injectable, Logger } from '@nestjs/common';

interface ILogger {
  debug(context: string, message: string): void;
  log(context: string, message: string): void;
  error(context: string, message: string, trace?: string): void;
  warn(context: string, message: string): void;
  verbose(context: string, message: string): void;
}

@Injectable()
export class LoggerService extends Logger implements ILogger {
  debug(context: string, message: string) {
    super.debug(`[DEBUG] ${message}`, context);
  }

  log(context: string, message: string) {
    super.log(`[LOG] ${message}`, context);
  }

  error(context: string, message: string, trace?: string) {
    super.error(`[ERROR] ${message}`, trace, context);
  }

  warn(context: string, message: string) {
    super.warn(`[WARN] ${message}`, context);
  }

  verbose(context: string, message: string) {
    super.verbose(`[VERBOSE] ${message}`, context);
  }
}
