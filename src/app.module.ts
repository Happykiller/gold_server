// src\app.module.ts
/* istanbul ignore file */
import { Module } from '@nestjs/common';
import type { JwtModuleOptions } from '@nestjs/jwt';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { config } from '@src/config';
import { version } from '../package.json';
import inversify from '@src/inversify/investify';
import { logger } from '@src/common/logger/logger';
import { createMetricsPlugin } from '@presentation/graphql/metrics.plugin';
import { RequestCache } from '@src/common/graphql/request.cache';
import { AccountModule } from '@presentation/account/account.module';
import { OperationModule } from '@presentation/operation/operation.module';
import {
  AuthGuardModule,
  AuthModule,
  PasskeyModule,
  SystemModule,
  TestModule,
  UserModule,
} from '@happykiller/sunny-apis';

@Module({
  imports: [
    // Sunny
    TestModule,
    AuthGuardModule.forRoot({
      appConfig: config,
      inversify,
    }),
    AuthModule.forRoot({
      // Même écart de typage que dans JwtServiceReal : sunny-apis déclare
      // `signOptions.expiresIn` en `string`, là où JwtModuleOptions attend un
      // littéral de durée. La valeur ('8h') est valide.
      jwtConfig: config.jwt as JwtModuleOptions,
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
    UserModule.forRoot({
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
      // Le cache naît et meurt avec la requête : c'est la seule durée de vie
      // acceptable pour un solde ou un référentiel — voir request.cache.ts.
      context: ({ req, res }) => {
        return { req, res, cache: new RequestCache() };
      },
      plugins: config.log?.metrics
        ? [
            createMetricsPlugin({
              slowOperationMs: config.log?.slowOperationMs,
              log: (message, meta) => logger.info(message, meta),
            }),
          ]
        : [],
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot(config.throttle),
  ],
})
export class AppModule {}
