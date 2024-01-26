import { Inversify } from '@src/inversify/investify';
import { OperationLinkUsecaseModel } from '@usecase/model/operationLink.usecase.model';
import { GetOperationLinksUsecaseDto } from '@usecase/dto/getOperationLinks.usecase.dto';

export class GetOperationLinksUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: GetOperationLinksUsecaseDto): Promise<OperationLinkUsecaseModel[]> {
    return await this.inversify.bddService.getOperationLinks(dto);
  }
}