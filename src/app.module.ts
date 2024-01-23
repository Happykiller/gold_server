import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { config } from './config';
import { HelloModule } from './presentation/hello/hello.module';
import { TestModule } from './presentation/test/test.module';
import { AccountModule } from './presentation/account/account.module';
import { OperationModule } from './presentation/operation/operation.module';
import { AuthModule } from './presentation/auth/auth.module';

@Module({
  imports: [
    TestModule,
    HelloModule,
    AccountModule,
    OperationModule,
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: {
        'subscriptions-transport-ws': {
          path: '/graphql',
          onConnect: (connectionParams: { Authorization: string }) => {
            return { req: { Authorization: connectionParams.Authorization } };
          },
        },
        'graphql-ws': {
          path: '/graphql',
          onConnect: (context: any) => {
            const { connectionParams, subscriptions } = context;
            return { req: { Authorization: connectionParams.Authorization } };
          }
        },
      },
      playground: config.graphQL.playground,
      introspection: config.graphQL.introspection,
      autoSchemaFile: config.graphQL.schemaFileName,
      context: ({ req, res }) => {
        return { req, res };
      },
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot(config.ratelimit),
  ]
})
export class AppModule {}
