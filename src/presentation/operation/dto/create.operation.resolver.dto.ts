import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOperationInputResolver {
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
  @Field(() => Float, { nullable: true })
  vat_rate?: number;
  @Field(() => String, { nullable: true })
  description: string;
  /**
   * Les opérations que ce virement prend en charge.
   *
   * Les liens naissent avec le virement plutôt qu'après lui : une mutation par
   * lien laissait un virement à moitié lié dès qu'un appel échouait, sans que
   * le client sache revenir en arrière. Les identifiants sont filtrés par le
   * service — celui qui n'appartient pas à l'utilisateur est ignoré, jamais lu.
   */
  @Field(() => [Int], { nullable: true })
  linked_operation_ids?: number[];
}
