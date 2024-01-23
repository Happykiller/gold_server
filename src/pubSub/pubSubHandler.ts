
import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IPubSubHandler {
  publish(eventName: string, payload: any): Promise<void>;
  asyncIterator(eventName: string): AsyncIterator<unknown, any, undefined>;
}

@Injectable()
export class PubSubHandler implements IPubSubHandler {

  private pubSub: PubSub;

  constructor() {
    this.pubSub = new PubSub();
  }

  async publish(eventName: string, payload: any): Promise<void> {
    await this.pubSub.publish(eventName, payload);
    return;
  }

  asyncIterator(eventName: string): AsyncIterator<unknown, any, undefined> {
    return this.pubSub.asyncIterator(eventName);
  }
}