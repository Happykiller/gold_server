import { PubSub } from 'graphql-subscriptions';
import { PubSubHandler } from './pubSubHandler';

describe('PubSubHandler', () => {

  const handler = new PubSubHandler();

  // mock private property pubSub
  const pubSub: PubSub = handler['pubSub'];
  const spyPublish = jest.spyOn(pubSub, 'publish');
  const spyAsync = jest.spyOn(pubSub, 'asyncIterator');

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('#publish', () => {

    it('Should publish an event with a payload', async () => {
      // arrange
      spyPublish.mockResolvedValueOnce();
      // act
      await handler.publish('testEvent', 'test payload');
      // assert
      expect(spyPublish).toHaveBeenCalledTimes(1);
    });

  });

  describe('#asyncIterator', () => {

    it('Should listen to an event and get the payload', async () => {
      // arrange
      const iterator: AsyncIterator<unknown, any, undefined> = { next: null }; // eslint-disable-line @typescript-eslint/no-explicit-any

      spyAsync.mockReturnValueOnce(iterator);
      // act
      const result = handler.asyncIterator('test');
      // assert
      expect(result).toStrictEqual(iterator);
      expect(spyAsync).toHaveBeenCalledTimes(1);
    });

  });
});