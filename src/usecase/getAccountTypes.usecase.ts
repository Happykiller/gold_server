import { Inversify } from '@src/inversify/investify';
import { AccountTypeUsecaseModel } from '@src/usecase/model/accountType.usecase.model';

export class GetAccountTypesUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(): Promise<AccountTypeUsecaseModel[]> {
    return await this.inversify.bddService.getAccountTypes();
  }
}