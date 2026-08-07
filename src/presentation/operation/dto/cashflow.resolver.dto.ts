import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CashflowInputResolver {
  @Field(() => [Int])
  account_ids: number[];

  @Field(() => String)
  start_date: string;

  @Field(() => String)
  end_date: string;
}
