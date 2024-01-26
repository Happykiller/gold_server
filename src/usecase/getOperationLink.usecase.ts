import { Inversify } from '@src/inversify/investify';
import { GetOperationLinkUsecaseDto } from './dto/getOperationLink.usecase.dto';
import { OperationLinkUsecaseModel } from './model/operationLink.usecase.model';

export class GetOperationLinkUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: GetOperationLinkUsecaseDto): Promise<OperationLinkUsecaseModel> {
    return await this.inversify.bddService.getOperationLink(dto);
  }
}