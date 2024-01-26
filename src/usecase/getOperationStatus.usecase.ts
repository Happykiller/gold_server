import { Inversify } from '@src/inversify/investify';
import { OperationStatutUsecaseModel } from '@usecase/model/operationStatut.usecase.model';

export class GetOperationStatusUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(): Promise<OperationStatutUsecaseModel[]> {
    return await this.inversify.bddService.getOperationStatus();
  }
}