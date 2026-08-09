import { Field, InputType, Int, OmitType, PartialType } from '@nestjs/graphql';
import { CreateOperationInputResolver } from '@presentation/operation/dto/create.operation.resolver.dto';

/**
 * `linked_operation_ids` est retiré du contrat de mise à jour.
 *
 * `PartialType` l'aurait hérité de la création, et `updateOperation` ne sait
 * pas poser de liens : le champ aurait été accepté puis jeté en silence —
 * précisément le défaut que la restauration des liens vient corriger côté
 * front. Les liens d'une opération existante se gèrent un par un, par
 * `createOperationLink` et `deleteOperationLink`.
 */
@InputType()
export class UpdateOperationInputResolver extends PartialType(
  OmitType(CreateOperationInputResolver, ['linked_operation_ids'] as const),
) {
  @Field(() => Int)
  operation_id: number;
}
