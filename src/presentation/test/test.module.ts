/* istanbul ignore file */
import { Module } from '@nestjs/common';

import { TestResolver } from '@presentation/test/test.resolver';
import { PubSubHandler } from '@presentation/pubSub/pubSubHandler';

@Module({
  imports: [],
  providers: [
    TestResolver,
    {
      useValue: new PubSubHandler(),
      provide: 'PubSubHandler'
    }
  ],
})
export class TestModule {}