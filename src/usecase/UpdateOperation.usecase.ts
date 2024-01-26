import { Inversify } from '@src/inversify/investify';
import { OperationUsecaseModel } from '@usecase/model/operation.usecase.model';
import { UpdateOperationUsecaseDto } from '@usecase/dto/updateOperation.usecase.dto';

export class UpdateOperationUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: UpdateOperationUsecaseDto): Promise<OperationUsecaseModel> {
    return await this.inversify.bddService.updateOperation(dto);
  }
}