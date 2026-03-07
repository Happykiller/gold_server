import { Inversify } from '@src/inversify/investify';
import { OperationTypeUsecaseModel } from '@usecase/model/operationType.usecase.model';
import { GetOperationTypesUsecaseDto } from '@usecase/dto/getOperationTypes.usecase.dto';

export class GetOperationTypesUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: GetOperationTypesUsecaseDto): Promise<OperationTypeUsecaseModel[]> {
    return await this.inversify.bddService.getOperationTypes(dto);
  }
}