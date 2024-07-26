import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PasskeyAuthResolverDto {
  @Field(() => String)
  user_code: string;
  @Field(() => String)
  credentialId: string;
  @Field(() => String)
  authenticatorData: string;
  @Field(() => String)
  clientData: string;
  @Field(() => String)
  signature: string;
  @Field(() => String)
  userHandle: string;
}
