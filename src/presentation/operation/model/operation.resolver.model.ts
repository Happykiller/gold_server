import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OperationModelResolver {
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
  @Field(() => Float)
  vat_rate: number;
  @Field(() => String)
  description: string;
  @Field(() => Boolean)
  active: boolean;
  @Field(() => Int)
  creator_id: number;
  @Field(() => String)
  creation_date: string;
  @Field(() => Int, { nullable: true })
  modificator_id: number;
  @Field(() => String, { nullable: true })
  modification_date: string;
  /** Nombre d'opérations que ce virement prend en charge. */
  @Field(() => Int)
  linked_count: number;
  /**
   * Nombre de virements qui prennent cette opération en charge.
   *
   * Un compteur, et non l'identifiant du porteur : la relation est N-N, plus de
   * cent opérations en production sont couvertes par plusieurs virements.
   */
  @Field(() => Int)
  linked_by_count: number;
}
