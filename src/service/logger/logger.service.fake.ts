/* istanbul ignore file */
import { LoggerService } from '@src/service/logger/logger.service';

export class LoggerServiceFake implements LoggerService {
  info(_message: string, _meta?: Record<string, unknown>): void {}
  error(_message: string, _meta?: Record<string, unknown>): void {}
}
