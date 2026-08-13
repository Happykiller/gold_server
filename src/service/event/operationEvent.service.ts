// src\service\event\operationEvent.service.ts
/**
 * Le bus qui prévient les clients qu'une opération a bougé.
 *
 * Pourquoi ici et pas dans un usecase : c'est un adaptateur de transport, il
 * n'a pas de règle métier et pas de méthode `execute(dto)`. Il vit donc dans la
 * couche service, comme `bddService` ou `jwtService`.
 *
 * Pourquoi un `PubSub` en mémoire : l'API tourne en un seul processus, en
 * développement comme en production (un conteneur `gold_back`). Un broker
 * externe ne se justifierait qu'à partir de deux instances — et il faudrait
 * alors le remplacer ici, à un seul endroit.
 *
 * Aucun besoin d'implémentation factice : ce bus ne parle à rien, il fonctionne
 * à l'identique en `mock` et en `test`.
 */
import { PubSub } from 'graphql-subscriptions';

/** Ce qui a changé. Sert au client à décider ce qu'il recharge. */
export type OperationChangeKind =
  'created' | 'updated' | 'deleted' | 'cloned' | 'linked';

export interface OperationsChangedPayload {
  kind: OperationChangeKind;
  /**
   * Comptes touchés. **Une liste vide veut dire « inconnu »**, pas « aucun » :
   * la suppression est logique et ne rend rien d'exploitable, un lien ne porte
   * pas de compte. Le client recharge alors sans chercher à filtrer.
   */
  account_ids: number[];
  operation_ids: number[];
  /**
   * Identifiant de l'onglet émetteur, `null` quand la mutation ne vient pas du
   * front (l'extension, un script). Il sert au client à ne pas se rafraîchir
   * sur ses propres écritures, qu'il a déjà appliquées à l'écran.
   */
  origin: string | null;
}

export class OperationEventService {
  private readonly pubsub = new PubSub();

  /**
   * Un sujet par utilisateur.
   *
   * C'est le cloisonnement de la loi 1 rendu structurel : un abonné ne reçoit
   * que ce qui est publié sur son propre sujet. Un filtre appliqué après coup
   * (`withFilter`) marcherait aussi, mais un filtre qu'on oublie fuit, alors
   * qu'un sujet auquel on n'est pas abonné ne peut pas fuir.
   */
  private topic(userId: number): string {
    return `operations:${userId}`;
  }

  publish(userId: number, payload: OperationsChangedPayload): void {
    // Volontairement sans `await` : une mutation ne doit ni ralentir ni échouer
    // parce qu'un abonné écoute mal. Le bus est en mémoire, la promesse est
    // déjà résolue.
    void this.pubsub.publish(this.topic(userId), {
      operationsChanged: payload,
    });
  }

  subscribe(userId: number): AsyncIterableIterator<unknown> {
    return this.pubsub.asyncIterableIterator(this.topic(userId));
  }
}
