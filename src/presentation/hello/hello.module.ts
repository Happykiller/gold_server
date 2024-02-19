/* istanbul ignore file */
import { Module } from '@nestjs/common';

import { HelloResolver } from '@presentation/hello/hello.resolver';
import { PubSubHandler } from '@presentation/pubSub/pubSubHandler';

@Module({
  imports: [],
  providers: [
    HelloResolver,
    {
      useValue: new PubSubHandler(),
      provide: 'PubSubHandler'
    }
  ],
})
export class HelloModule {}