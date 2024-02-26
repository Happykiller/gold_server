import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OperationThirdModelResolver {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  label: string;
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