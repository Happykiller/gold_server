import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOperationLinkInputResolver {
  @Field(() => Int)
  operation_id: number;
  @Field(() => Int)
  operation_ref_id: number;
}