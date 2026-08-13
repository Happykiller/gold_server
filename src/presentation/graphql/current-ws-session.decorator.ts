// src\presentation\graphql\current-ws-session.decorator.ts
/**
 * La session d'une connexion WebSocket.
 *
 * Pourquoi ce décorateur existe, alors que `@CurrentSession()` du socle sunny
 * fait exactement cela en HTTP : parce qu'il ne fonctionne pas en WebSocket, et
 * qu'il échoue **en silence**.
 *
 * `CurrentSession` lit `ctx.getContext().req.user`. Or `makeAuthGuard('ws')`
 * ne travaille pas sur le `req` du contexte : il n'en a pas — une connexion
 * WebSocket ne porte que des `connectionParams`. Il fabrique donc un `req`
 * local, y pose `.user`, et le jette. Ce qu'il laisse au contexte, c'est
 * `ctx.session` (`sunny-apis/dist/index.js`, `extractRequestResponse` et la
 * ligne `if (ctx) ctx.session = req.user`).
 *
 * Employer `@CurrentSession()` sur une subscription rendrait donc `undefined`,
 * et `parseInt(undefined)` un `NaN` : l'abonnement se ferait sur le sujet
 * `operations:NaN`, personne ne recevrait rien, et rien ne le signalerait. Le
 * cloisonnement de la loi 1 se jouant sur cet identifiant, l'erreur ne doit pas
 * être possible.
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserSession } from '@happykiller/sunny-apis';

export const CurrentWsSession = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserSession =>
    GqlExecutionContext.create(context).getContext().session,
);
