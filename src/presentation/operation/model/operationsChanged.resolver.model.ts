import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * Ce que reçoit un client abonné aux changements d'opérations.
 *
 * Volontairement maigre : c'est un **signal**, pas une donnée. Le client
 * recharge ce qu'il affiche par les requêtes qu'il connaît déjà, plutôt que de
 * tenter d'appliquer un delta — ce qui obligerait à porter ici la forme
 * complète d'une opération et à la garder en phase avec la liste.
 */
@ObjectType()
export class OperationsChangedModelResolver {
  /** `created`, `updated`, `deleted`, `cloned` ou `linked`. */
  @Field(() => String)
  kind: string;

  /**
   * Comptes touchés. **Une liste vide veut dire « inconnu »**, pas « aucun » :
   * la suppression est logique et ne rend rien d'exploitable, un lien ne porte
   * pas de compte. Le client recharge alors sans chercher à filtrer.
   */
  @Field(() => [Int])
  account_ids: number[];

  @Field(() => [Int])
  operation_ids: number[];

  /**
   * Identifiant de l'onglet à l'origine du changement, `null` quand la mutation
   * ne vient pas du front — l'extension, un script. Il sert au client à ignorer
   * ses propres écritures, qu'il a déjà appliquées à l'écran.
   */
  @Field(() => String, { nullable: true })
  origin: string | null;
}
