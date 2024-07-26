import { AuthenticationParsed } from '@service/passwordless/lib/types';
import { PasswordLessService } from '@service/passwordless/passwordless.service';

export class PasswordLessServiceFake implements PasswordLessService {
  verifyAuthentication(): Promise<AuthenticationParsed> {
    return Promise.resolve(null);
  }
}
