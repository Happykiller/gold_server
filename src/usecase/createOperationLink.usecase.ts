import { Inversify } from '@src/inversify/investify';
import { OperationLinkUsecaseModel } from '@usecase/model/operationLink.usecase.model';
import { CreateOperationLinkUsecaseDto } from '@usecase/dto/createOperationLink.usecase.dto';

export class CreateOperationLinkUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: CreateOperationLinkUsecaseDto): Promise<OperationLinkUsecaseModel> {
    return await this.inversify.bddService.createOperationLink(dto);
  }
}