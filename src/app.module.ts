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

/**
 * Les deux formes que peut prendre l'argument du callback `context`.
 *
 * En HTTP, Apollo passe la requête et la réponse Express. En WebSocket,
 * `graphql-ws` passe son propre contexte de connexion, dont les seules clés
 * utiles ici sont `connectionParams` (ce que le client a envoyé à
 * l'établissement de la connexion) et `extra` (le socket, qui sert seulement à
 * reconnaître ce cas).
 */
interface GraphQLContextInput {
  req?: unknown;
  res?: unknown;
  connectionParams?: Record<string, unknown>;
  extra?: unknown;
}

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
      // Le temps réel passe par `graphql-ws` sur le même chemin que les
      // requêtes : un seul port, une seule URL, le client dérive `ws://` de
      // l'adresse de l'API. `subscriptions-transport-ws`, l'ancien protocole,
      // reste volontairement absent — il est déprécié et personne ne le parle
      // ici.
      subscriptions: {
        'graphql-ws': { path: '/graphql' },
      },
      // Le cache naît et meurt avec la requête : c'est la seule durée de vie
      // acceptable pour un solde ou un référentiel — voir request.cache.ts.
      //
      // Ce callback est le MÊME pour les deux transports : Nest le repasse tel
      // quel à `graphql-ws` (`gql-subscription.service.ts`, option `context`).
      // Or une connexion WebSocket n'a ni `req` ni `res` — elle porte des
      // `connectionParams`. Le déstructurer en `{ req, res }` rendait donc
      // `req` indéfini sur toute subscription, et le guard rejetait tout.
      //
      // On fabrique ici le `req` porteur attendu par `makeAuthGuard('ws')` du
      // socle sunny, qui lit le jeton dans `req.connectionParams`.
      context: (ctx: GraphQLContextInput) => {
        if (ctx?.connectionParams !== undefined || ctx?.extra !== undefined) {
          return {
            req: { connectionParams: ctx.connectionParams ?? {} },
            res: null,
            cache: new RequestCache(),
          };
        }
        return { req: ctx.req, res: ctx.res, cache: new RequestCache() };
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
