import { Inversify } from '@src/inversify/investify';
import { OperationUsecaseModel } from '@usecase/model/operation.usecase.model';
import { CloneOperationsUsecaseDto } from '@usecase/dto/cloneOperations.usecase.dto';

export class CloneOperationsUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: CloneOperationsUsecaseDto): Promise<OperationUsecaseModel[]> {
    return await this.inversify.bddService.cloneOperations(dto);
  }
}