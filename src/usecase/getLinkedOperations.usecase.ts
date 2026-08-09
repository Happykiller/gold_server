import { Inversify } from '@src/inversify/investify';
import { LinkedOperationUsecaseModel } from '@usecase/model/linkedOperation.usecase.model';
import { GetLinkedOperationsUsecaseDto } from '@usecase/dto/getLinkedOperations.usecase.dto';

export class GetLinkedOperationsUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(
    dto: GetLinkedOperationsUsecaseDto,
  ): Promise<LinkedOperationUsecaseModel[]> {
    return await this.inversify.bddService.getLinkedOperations(dto);
  }
}
