import { Inject, UseGuards } from '@nestjs/common';
import { Field, ObjectType, Query, Resolver } from '@nestjs/graphql';

import { TokenGuard } from '@src/presentation/guard/token.guard';
import inversify from '../../inversify/investify';

@ObjectType()
export class TestModelResolver {
  @Field(() => Boolean, { nullable: true })
  resultat: boolean;
}

@Resolver('TestResolver')
export class TestResolver {
  @UseGuards(TokenGuard)
  @Query(
    /* istanbul ignore next */
    () => TestModelResolver
  )
  async testBdd(): Promise<TestModelResolver> {

    return {
      resultat: await inversify.testBddUsecase.execute()
    };
  }
}