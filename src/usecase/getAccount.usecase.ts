import { Inversify } from '@src/inversify/investify';
import { AccountUsecaseModel } from '@src/usecase/model/account.usecase.model';
import { GetAccountUsecaseDto } from '@src/usecase/dto/getAccount.usecase.dto';

export class GetAccountUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: GetAccountUsecaseDto): Promise<AccountUsecaseModel> {
    return await this.inversify.bddService.getAccount(dto);
  }
}