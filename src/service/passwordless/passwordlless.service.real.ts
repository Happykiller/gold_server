import * as server from '@service/passwordless/lib/server';
import { PasswordLessService } from '@service/passwordless/passwordless.service';
import { AuthenticationEncoded, CredentialKey, AuthenticationParsed } from '@service/passwordless/lib/types';

export class PasswordLessServiceReal implements PasswordLessService {
  verifyAuthentication(authenticationRaw: AuthenticationEncoded, credential: CredentialKey, expected: any): Promise<AuthenticationParsed> {
    return server.verifyAuthentication(authenticationRaw, credential, expected);
  }
}
