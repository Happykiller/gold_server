import { CreatePasskeyResolverDto } from '@presentation/passkey/dto/passkey.register.auth.resolver.dto';

export default interface CreatePasskeyUsecaseDto
  extends CreatePasskeyResolverDto {
  user_id: string;
  user_code: string;
}
