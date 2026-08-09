import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

/**
 * Une opération vue depuis un lien.
 *
 * Type **plat**, et non `OperationModelResolver` : ce dernier porte des
 * `@ResolveField`, dont désormais les liens eux-mêmes, et un client pourrait
 * descendre `linked_operations { linked_by_operations { … } }` indéfiniment —
 * aucun `depthLimit` n'est configuré sur ce serveur. Rien, ici, ne se résout
 * plus loin.
 *
 * `link_id` est ce qui rend le retrait possible depuis l'écran de détail :
 * `deleteOperationLink` travaille sur le lien, pas sur le couple d'opérations.
 */
@ObjectType()
export class LinkedOperationModelResolver {
  @Field(() => Int)
  link_id: number;
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  account_id: number;
  @Field(() => Int, { nullable: true })
  account_id_dest: number;
  @Field(() => Float)
  amount: number;
  @Field(() => String)
  date: string;
  @Field(() => Int)
  status_id: number;
  @Field(() => Int)
  type_id: number;
  @Field(() => Int, { nullable: true })
  third_id: number;
  @Field(() => Int, { nullable: true })
  category_id: number;
  @Field(() => String, { nullable: true })
  description: string;
}
