import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CloneOperationInputResolver {
  @Field(() => Int)
  account_id: number;
  @Field(() => Int)
  template_account_id: number;
  @Field(() => String)
  date: string;
}