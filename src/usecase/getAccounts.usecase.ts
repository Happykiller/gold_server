import { Inversify } from '@src/inversify/investify';
import { AccountUsecaseModel } from '@src/usecase/model/account.usecase.model';
import { GetAccountsUsecaseDto } from '@src/usecase/dto/getAccounts.usecase.dto';

export class GetAccountsUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: GetAccountsUsecaseDto): Promise<AccountUsecaseModel[]> {
    return await this.inversify.bddService.getAccounts(dto);
  }
}