import { ERRORS } from '@src/common/ERROR';
import { Inversify } from '@src/inversify/investify';
import { AccountUsecaseModel } from '@src/usecase/model/account.usecase.model';
import { UpdateAccountUsecaseDto } from '@src/usecase/dto/updateAccount.usecase.dto';

export class UpdateAccountUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: UpdateAccountUsecaseDto): Promise<AccountUsecaseModel> {
    // Même garde que pour les opérations : la mise à jour est partielle, donc
    // le service relit le compte pour combler les champs absents du dto. Sans
    // cette vérification, un compte inconnu ferait échouer la lecture de ses
    // champs et remonterait au client en erreur interne.
    //
    // La lecture filtre sur le créateur : le compte d'un autre utilisateur est
    // traité comme inexistant, délibérément.
    const existing = await this.inversify.bddService.getAccount({
      account_id: dto.account_id,
      user_id: dto.user_id,
    });

    if (!existing) {
      throw new Error(ERRORS.ACCOUNT_NOT_FOUND);
    }

    return await this.inversify.bddService.updateAccount(dto);
  }
}
