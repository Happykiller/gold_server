import { RegistrationInfo } from '@passwordless-id/webauthn/dist/esm/types';
import CreatePasskeyUsecaseDto from '@usecase/passkey/dto/create.passkey.usecase.dto';

export default interface CreatePasskeyDbDto extends CreatePasskeyUsecaseDto {
  registrationParsed: RegistrationInfo
}
