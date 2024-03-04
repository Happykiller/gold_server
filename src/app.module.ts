/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { config } from '@src/config';
import { TestModule } from '@presentation/test/test.module';
import { AuthModule } from '@presentation/auth/auth.module';
import { HelloModule } from '@presentation/hello/hello.module';
import { SystemModule } from '@presentation/system/system.module';
import { AccountModule } from '@presentation/account/account.module';
import { OperationModule } from '@presentation/operation/operation.module';

@Module({
  imports: [
    TestModule,
    HelloModule,
    SystemModule,
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
