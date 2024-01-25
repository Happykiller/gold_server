import { Inversify } from '@src/inversify/investify';
import { DeleteAccountUsecaseDto } from '@src/usecase/dto/deleteAccount.usecase.dto';

export class DeleteAccountUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: DeleteAccountUsecaseDto): Promise<boolean> {
    return await this.inversify.bddService.deleteAccount(dto);
  }
}