import { Field, Float, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class CashflowModelResolver {
    @Field(() => Int)
    account_id: number;

    @Field(() => String)
    date: string;

    @Field(() => Float)
    reconciled_balance: number;

    @Field(() => Float)
    total_balance: number;
}
