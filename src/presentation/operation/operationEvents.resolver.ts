// src\presentation\operation\operationEvents.resolver.ts
import { UseGuards } from '@nestjs/common';
import { Resolver, Subscription } from '@nestjs/graphql';
import { makeAuthGuard, USER_ROLE, UserSession } from '@happykiller/sunny-apis';

import inversify from '@src/inversify/investify';
import { CurrentWsSession } from '@presentation/graphql/current-ws-session.decorator';
import { OperationsChangedModelResolver } from '@presentation/operation/model/operationsChanged.resolver.model';

/**
 * Le seul point d'écoute du temps réel.
 *
 * Séparé d'`operation.resolver.ts`, qui passe déjà 400 lignes et ne parle que
 * de requêtes et de mutations : ici il n'est question que d'abonnement.
 *
 * L'abonnement est **cloisonné par le sujet**, pas par un filtre appliqué après
 * coup : le client ne peut demander que le flux de sa propre session, il n'y a
 * pas d'argument à valider. C'est la loi 1 rendue structurelle.
 */
@Resolver()
export class OperationEventsResolver {
  @UseGuards(makeAuthGuard('ws', [USER_ROLE.ALL]))
  @Subscription(
    /* istanbul ignore next */
    () => OperationsChangedModelResolver,
    { name: 'operationsChanged' },
  )
  operationsChanged(
    // `@CurrentWsSession` et non `@CurrentSession` : le guard ne pose pas
    // `req.user` en mode WebSocket. Voir le décorateur, qui explique pourquoi
    // l'erreur serait silencieuse.
    @CurrentWsSession() session: UserSession,
  ): AsyncIterableIterator<unknown> {
    return inversify.operationEventService.subscribe(parseInt(session.id));
  }
}
