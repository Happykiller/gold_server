import {
  AuthenticationInfo,
  AuthenticationJSON,
  CredentialInfo,
  RegistrationInfo,
  RegistrationJSON,
} from '@passwordless-id/webauthn/dist/esm/types';

import { PasswordLessService } from '@service/passwordless/passwordless.service';

export class PasswordLessServiceFake implements PasswordLessService {
  verifyRegistration(
    _registrationJson: RegistrationJSON,
    _expected: any,
  ): Promise<RegistrationInfo> {
    return Promise.resolve(null);
  }

  verifyAuthentication(
    _authenticationJson: AuthenticationJSON,
    _credential: CredentialInfo,
    _expected: any,
  ): Promise<AuthenticationInfo> {
    return Promise.resolve(null);
  }
}
