import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SystemInfoResolverModel {
  @Field(() => String)
  version: string;
}