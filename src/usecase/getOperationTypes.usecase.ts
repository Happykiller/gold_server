import { Inversify } from '@src/inversify/investify';
import { OperationTypeUsecaseModel } from '@usecase/model/operationType.usecase.model';

export class GetOperationTypesUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(): Promise<OperationTypeUsecaseModel[]> {
    return await this.inversify.bddService.getOperationTypes();
  }
}