import { Inversify } from '@src/inversify/investify';
import { OperationCategoryUsecaseModel } from '@usecase/model/operationCategory.usecase.model';
import { GetOperationCategoriesUsecaseDto } from '@usecase/dto/getOperationCategories.usecase.dto';

export class GetOperationCategoriesUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(
    dto: GetOperationCategoriesUsecaseDto,
  ): Promise<OperationCategoryUsecaseModel[]> {
    return await this.inversify.bddService.getOperationCategories(dto);
  }
}
