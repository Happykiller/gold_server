import { Inversify } from '@src/inversify/investify';
import { DeleteOperationLinkUsecaseDto } from '@usecase/dto/deleteOperationLink.usecase.dto';

export class DeleteOperationLinkUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: DeleteOperationLinkUsecaseDto): Promise<boolean> {
    // Le service filtre déjà sur le créateur, mais la lecture préalable rend la
    // garde explicite et testable sans base. Un lien inconnu et un lien
    // appartenant à un autre utilisateur donnent la même réponse : rien ne
    // permet de distinguer les deux depuis l'extérieur.
    const existing = await this.inversify.bddService.getOperationLink({
      operation_link_id: dto.operation_link_id,
      user_id: dto.user_id,
    });

    if (!existing) {
      return false;
    }

    return await this.inversify.bddService.deleteOperationLink(dto);
  }
}
