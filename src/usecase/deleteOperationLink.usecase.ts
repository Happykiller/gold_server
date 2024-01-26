import { Inversify } from '@src/inversify/investify';
import { DeleteOperationLinkUsecaseDto } from '@usecase/dto/deleteOperationLink.usecase.dto';

export class DeleteOperationLinkUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: DeleteOperationLinkUsecaseDto): Promise<boolean> {
    return await this.inversify.bddService.deleteOperationLink(dto);
  }
}