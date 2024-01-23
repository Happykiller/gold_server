import { Inject, UseGuards } from '@nestjs/common';
import { Field, ObjectType, Query, Resolver } from '@nestjs/graphql';
import inversify from '../../inversify/investify';
import { GqlAuthGuard } from '../guard/auth.guard';
import { UserSession } from '../auth/jwt.strategy';
import { CurrentSession } from '../guard/userSession.decorator';

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
    console.log(session);
    return {
      resultat: await inversify.testBddUsecase.execute()
    };
  }
}