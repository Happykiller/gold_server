import { Inversify } from '@src/inversify/investify';
import { AccountUsecaseModel } from '@src/usecase/model/account.usecase.model';
import { UpdateAccountUsecaseDto } from '@src/usecase/dto/updateAccount.usecase.dto';

export class UpdateAccountUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: UpdateAccountUsecaseDto): Promise<AccountUsecaseModel> {
    return await this.inversify.bddService.updateAccount(dto);
  }
}