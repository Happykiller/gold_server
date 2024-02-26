import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetOperationLinkInputResolver {
  @Field(() => Int)
  operation_link_id: number;
}