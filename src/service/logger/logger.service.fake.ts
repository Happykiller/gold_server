/* istanbul ignore file */
import { LoggerService } from '@src/service/logger/logger.service';

export class LoggerServiceFake implements LoggerService {
  info(): void {}
  error(): void {}
}