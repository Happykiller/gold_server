import { Inversify } from '@src/inversify/investify';
import { AccountUsecaseModel } from '@src/usecase/model/account.usecase.model';
import { CreateAccountUsecaseDto } from '@src/usecase/dto/createAccount.usecase.dto';

export class CreateAccountUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: CreateAccountUsecaseDto): Promise<AccountUsecaseModel> {
    return await this.inversify.bddService.createAccount(dto);
  }
}