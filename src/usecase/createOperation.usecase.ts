import { Inversify } from '@src/inversify/investify';
import { OperationUsecaseModel } from '@usecase/model/operation.usecase.model';
import { CreateOperationUsecaseDto } from '@usecase/dto/createOperation.usecase.dto';

export class CreateOperationUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: CreateOperationUsecaseDto): Promise<OperationUsecaseModel> {
    return await this.inversify.bddService.createOperation(dto);
  }
}