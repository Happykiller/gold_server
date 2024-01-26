import { Inversify } from '@src/inversify/investify';
import { DeleteOperationUsecaseDto } from '@usecase/dto/deleteOperation.usecase.dto';

export class DeleteOperationUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: DeleteOperationUsecaseDto): Promise<boolean> {
    return await this.inversify.bddService.deleteOperation(dto);
  }
}