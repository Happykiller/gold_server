import { SkipThrottle } from '@nestjs/throttler';
import { Inject, UseGuards } from '@nestjs/common';
import { Field, ObjectType, Query, Resolver, Subscription } from '@nestjs/graphql';

import { PubSubHandler } from '@src/pubSub/pubSubHandler';
import { GqlAuthGuard } from '../guard/auth.guard';

@ObjectType()
export class HelloModelResolver {
  @Field(() => String, { nullable: true })
  message: string;
}

@Resolver('HelloResolver')
export class HelloResolver {

  constructor(
    @Inject('PubSubHandler')
    private pubSubHandler: PubSubHandler
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => HelloModelResolver
  )
  async hello(): Promise<HelloModelResolver> {
    return {
      message: 'Hello World'
    };
  }

  @SkipThrottle()
  @UseGuards(GqlAuthGuard)
  @Subscription(
    /* istanbul ignore next */
    (): typeof HelloModelResolver => HelloModelResolver, {
      /* istanbul ignore next */
      async resolve(payload: any, args: any, context: any, info: any) {
        return {
          message: 'Hello World'
        };
      }
    })
  /* istanbul ignore next */
  async subHello() {
    return this.pubSubHandler.asyncIterator('refreshSession');
  }
}