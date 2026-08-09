import { Inversify } from '@src/inversify/investify';
import { OperationUsecaseModel } from '@usecase/model/operation.usecase.model';
import { CreateOperationUsecaseDto } from '@usecase/dto/createOperation.usecase.dto';

export class CreateOperationUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(
    dto: CreateOperationUsecaseDto,
  ): Promise<OperationUsecaseModel> {
    const { linked_operation_ids, ...operationDto } = dto;

    const operation =
      await this.inversify.bddService.createOperation(operationDto);

    if (!linked_operation_ids?.length) {
      return operation;
    }

    try {
      await this.inversify.bddService.createOperationLinks({
        user_id: dto.user_id,
        operation_id: operation.id,
        operation_ref_ids: linked_operation_ids,
      });
    } catch (error) {
      // Compensation : un virement créé sans les opérations qu'il prend en
      // charge est un virement faux, et rien côté client ne le rattraperait.
      // Le dépôt n'a aucune primitive de transaction — tout passe par
      // `pool.execute` — donc la suppression logique rétablit l'état antérieur,
      // au prix d'une ligne inactive.
      await this.inversify.bddService.deleteOperation({
        user_id: dto.user_id,
        operation_id: operation.id,
      });
      throw error;
    }

    // Relecture : `createOperation` a rendu l'opération telle qu'elle était
    // AVANT que les liens n'existent, donc avec `linked_count` à 0. Le client
    // qui affiche le virement qu'il vient de créer le verrait sans les
    // opérations qu'il vient lui-même de lui rattacher.
    return (
      (await this.inversify.bddService.getOperation({
        user_id: dto.user_id,
        operation_id: operation.id,
      })) ?? operation
    );
  }
}
