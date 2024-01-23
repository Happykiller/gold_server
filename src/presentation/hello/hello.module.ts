import { Module } from '@nestjs/common';

import { HelloResolver } from './hello.resolver';
import { PubSubHandler } from '../../pubSub/pubSubHandler';

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