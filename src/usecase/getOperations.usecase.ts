import { Inversify } from '@src/inversify/investify';
import { OperationUsecaseModel } from '@usecase/model/operation.usecase.model';
import { GetOperationsUsecaseDto } from '@usecase/dto/getOperations.usecase.dto';

export class GetOperationsUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: GetOperationsUsecaseDto): Promise<OperationUsecaseModel[]> {
    return await this.inversify.bddService.getOperations(dto);
  }
}