import { Inversify } from '@src/inversify/investify';
import { GetOperationUsecaseDto } from '@usecase/dto/getOperation.usecase.dto';
import { OperationUsecaseModel } from '@usecase/model/operation.usecase.model';

export class GetOperationUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: GetOperationUsecaseDto): Promise<OperationUsecaseModel> {
    return await this.inversify.bddService.getOperation(dto);
  }
}