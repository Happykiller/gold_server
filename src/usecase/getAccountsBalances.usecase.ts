import { Inversify } from '@src/inversify/investify';
import { GetAccountsUsecaseDto } from '@usecase/dto/getAccounts.usecase.dto';
import { AccountBalanceServiceModel } from '@service/bdd/model/accountBalance.service.model';

/**
 * Les deux soldes de tous les comptes de l'utilisateur, en une passe.
 *
 * Rend une `Map` plutôt qu'un tableau : l'appelant est un resolver de champs
 * qui cherche un compte précis, et le faire sur un tableau lui rendrait le
 * `.find()` par ligne qu'on cherche justement à supprimer.
 */
export class GetAccountsBalancesUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(
    dto: GetAccountsUsecaseDto,
  ): Promise<Map<number, AccountBalanceServiceModel>> {
    const balances = await this.inversify.bddService.getAccountsBalances(dto);
    return new Map(balances.map((balance) => [balance.account_id, balance]));
  }
}
