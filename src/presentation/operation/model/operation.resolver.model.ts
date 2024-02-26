import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OperationModelResolver {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  account_id: number;
  @Field(() => Int, { nullable: true })
  account_id_dest: number;
  @Field(() => Float)
  amount: number;
  @Field(() => String)
  date: string;
  @Field(() => Int)
  status_id: number;
  @Field(() => Int)
  type_id: number;
  @Field(() => Int, { nullable: true })
  third_id: number;
  @Field(() => Int, { nullable: true })
  category_id: number;
  @Field(() => String)
  description: string;
  @Field(() => Boolean)
  active: boolean;
  @Field(() => Int)
  creator_id: number;
  @Field(() => String)
  creation_date: string;
  @Field(() => Int, { nullable: true })
  modificator_id: number;
  @Field(() => String, { nullable: true })
  modification_date: string;
}