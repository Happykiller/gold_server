import { Inversify } from '@src/inversify/investify';
import { OperationThridUsecaseModel } from '@usecase/model/operationThrid.usecase.model';

export class GetOperationThridsUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(): Promise<OperationThridUsecaseModel[]> {
    return await this.inversify.bddService.getOperationThrids();
  }
}