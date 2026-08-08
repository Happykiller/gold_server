// src\usecase\getOperations.usecase.ts
import { Inversify } from '@src/inversify/investify';
import { OperationUsecaseModel } from '@usecase/model/operation.usecase.model';
import { GetOperationsUsecaseDto } from '@usecase/dto/getOperations.usecase.dto';

/**
 * Plafond de lignes par appel.
 *
 * Le défaut de l'input GraphQL (100) est une valeur par défaut, pas un maximum :
 * rien n'empêchait un client de demander `limit: 1000000`, aussitôt injecté
 * dans le `LIMIT` du SQL. Le front lit par lots de 50.
 */
export const MAX_OPERATIONS_LIMIT = 200;

export class GetOperationsUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(
    dto: GetOperationsUsecaseDto,
  ): Promise<OperationUsecaseModel[]> {
    return await this.inversify.bddService.getOperations({
      ...dto,
      limit: Math.min(Math.max(dto.limit ?? 0, 0), MAX_OPERATIONS_LIMIT),
      offset: Math.max(dto.offset ?? 0, 0),
    });
  }
}
