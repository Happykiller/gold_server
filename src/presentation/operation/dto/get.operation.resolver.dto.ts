import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetOperationInputResolver {
  @Field(() => Int)
  operation_id: number;
}