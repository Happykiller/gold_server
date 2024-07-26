import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePasskeyRegistrationCredentialResolverDto {
  @Field(() => String)
  id: string;
  @Field(() => String)
  publicKey: string;
  @Field(() => String)
  algorithm: string;
}

@InputType()
export class CreatePasskeyRegistrationResolverDto {
  @Field(() => String)
  username: string;
  @Field(() => CreatePasskeyRegistrationCredentialResolverDto)
  credential: CreatePasskeyRegistrationCredentialResolverDto;
  @Field(() => String)
  authenticatorData: string;
  @Field(() => String)
  clientData: string;
  @Field(() => String)
  attestationData: string;
}

@InputType()
export class CreatePasskeyResolverDto {
  @Field(() => String)
  label: string;
  @Field(() => String)
  hostname: string;
  @Field(() => String)
  challenge: string;
  @Field(() => CreatePasskeyRegistrationResolverDto)
  registration: CreatePasskeyRegistrationResolverDto;
}
