import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetOperationsInputResolver {
  @Field(() => Int)
  account_id: number;
  @Field(() => Int, { nullable: true })
  limit: number = 100;
  @Field(() => Int, { nullable: true })
  offset: number = 0;
}