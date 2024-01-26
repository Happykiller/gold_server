import { Inversify } from '@src/inversify/investify';
import { OperationCategoryUsecaseModel } from '@usecase/model/operationCategory.usecase.model';

export class GetOperationCategoriesUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(): Promise<OperationCategoryUsecaseModel[]> {
    return await this.inversify.bddService.getOperationCategories();
  }
}