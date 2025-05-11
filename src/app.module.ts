/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { config } from '@src/config';
import { AuthModule } from '@presentation/auth/auth.module';
import { SystemModule } from '@presentation/system/system.module';
import { PasskeyModule } from '@presentation/passkey/passkey.module';
import { AccountModule } from '@presentation/account/account.module';
import { OperationModule } from '@presentation/operation/operation.module';

@Module({
  imports: [
    SystemModule,
    AccountModule,
    PasskeyModule,
    OperationModule,
    AuthModule,
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
    ThrottlerModule.forRoot(config.ratelimit),
  ]
})
export class AppModule {}
