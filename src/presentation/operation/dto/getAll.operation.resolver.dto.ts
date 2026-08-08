import { Field, Float, InputType, Int } from '@nestjs/graphql';

/**
 * Critères de lecture des opérations d'un compte.
 *
 * Tous les filtres sont nullables : la requête d'origine, qui ne passe que
 * `account_id`, `limit` et `offset`, reste valide telle quelle.
 *
 * Les critères de référentiel arrivent en **identifiants**, jamais en libellés.
 * C'est le front qui résout `cat:immo` en `category_ids: [7]`, parce que les
 * libellés des tiers, types et statuts sont des clés i18n traduites côté
 * client : chercher dessus ici porterait sur la clé, pas sur le mot affiché.
 *
 * Ne jamais ajouter de champ `user_id` : le resolver construit
 * `{ user_id: session, ...dto }`, un champ de même nom écraserait l'identité
 * de session par une valeur venue du client.
 */
@InputType()
export class GetOperationsInputResolver {
  @Field(() => Int)
  account_id: number;
  @Field(() => Int, { nullable: true })
  limit: number = 100;
  @Field(() => Int, { nullable: true })
  offset: number = 0;

  // Référentiels : plusieurs valeurs d'un même critère se cumulent en OU.
  @Field(() => [Int], { nullable: true })
  category_ids?: number[];
  @Field(() => [Int], { nullable: true })
  third_ids?: number[];
  /** Comptes de ventilation (`account_id_dest`) — les « enveloppes ». */
  @Field(() => [Int], { nullable: true })
  dest_account_ids?: number[];
  @Field(() => [Int], { nullable: true })
  type_ids?: number[];
  @Field(() => [Int], { nullable: true })
  status_ids?: number[];

  /** Recherche ciblée sur la description seule. */
  @Field(() => String, { nullable: true })
  description?: string;
  /** Recherche large : description, libellé du tiers ou de la catégorie. */
  @Field(() => String, { nullable: true })
  text?: string;

  @Field(() => Float, { nullable: true })
  amount_min?: number;
  @Field(() => Float, { nullable: true })
  amount_max?: number;

  /** Bornes incluses, au format `YYYY-MM-DD`. */
  @Field(() => String, { nullable: true })
  date_from?: string;
  @Field(() => String, { nullable: true })
  date_to?: string;
}
