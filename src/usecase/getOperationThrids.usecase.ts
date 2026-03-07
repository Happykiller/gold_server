import { Inversify } from '@src/inversify/investify';
import { OperationThridUsecaseModel } from '@usecase/model/operationThrid.usecase.model';
import { GetOperationThridsUsecaseDto } from '@usecase/dto/getOperationThrids.usecase.dto';

export class GetOperationThridsUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: GetOperationThridsUsecaseDto): Promise<OperationThridUsecaseModel[]> {
    return await this.inversify.bddService.getOperationThrids(dto);
  }
}