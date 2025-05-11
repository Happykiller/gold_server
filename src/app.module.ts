// src\app.module.ts
/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { config } from '@src/config';
import { version } from '../package.json';
import inversify from '@src/inversify/investify';
import { AccountModule } from '@presentation/account/account.module';
import { OperationModule } from '@presentation/operation/operation.module';
import { AuthGuardModule, AuthModule, PasskeyModule, SystemModule, TestModule } from '@happykiller/sunny-apis';

@Module({
  imports: [
    // Sunny
    TestModule,
    AuthGuardModule.forRoot({
      appConfig: config,
      inversify,
    }),
    AuthModule.forRoot({
      jwtConfig: config.jwt,
      appConfig: config,
      inversify,
    }),
    PasskeyModule.forRoot({
      inversify,
    }),
    SystemModule.forRoot({
      version,
      inversify,
    }),
    // Project
    AccountModule,
    OperationModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: config.graphQL.playground,
      introspection: config.graphQL.introspection,
      autoSchemaFile: config.graphQL.schemaFileName,
      context: ({ req, res }) => {
        return { req, res };
      },
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [config.ratelimit]
    }),
  ]
})
export class AppModule {}
