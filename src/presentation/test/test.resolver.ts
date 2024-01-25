import { UseGuards } from '@nestjs/common';
import { Field, ObjectType, Query, Resolver } from '@nestjs/graphql';

import inversify from '@src/inversify/investify';
import { GqlAuthGuard } from '@src/presentation/guard/auth.guard';
import { UserSession } from '@src/presentation/auth/jwt.strategy';
import { CurrentSession } from '@src/presentation/guard/userSession.decorator';

@ObjectType()
export class TestModelResolver {
  @Field(() => Boolean, { nullable: true })
  resultat: boolean;
}

@Resolver('TestResolver')
export class TestResolver {
  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => TestModelResolver
  )
  async testBdd(@CurrentSession() session: UserSession): Promise<TestModelResolver> {
    return {
      resultat: await inversify.testBddUsecase.execute()
    };
  }
}