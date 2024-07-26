import { AuthenticationEncoded, CredentialKey, AuthenticationParsed } from '@service/passwordless/lib/types';

export interface PasswordLessService {
  verifyAuthentication(authenticationRaw: AuthenticationEncoded, credential: CredentialKey, expected: any): Promise<AuthenticationParsed>;
}
