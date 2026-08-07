import { ERRORS } from '@src/common/ERROR';
import { Inversify } from '@src/inversify/investify';
import { OperationUsecaseModel } from '@usecase/model/operation.usecase.model';
import { UpdateOperationUsecaseDto } from '@usecase/dto/updateOperation.usecase.dto';

export class UpdateOperationUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(
    dto: UpdateOperationUsecaseDto,
  ): Promise<OperationUsecaseModel> {
    // La mise à jour est partielle : le service relit l'opération existante
    // pour combler les champs absents du dto. Sans cette garde, une opération
    // inconnue le faisait échouer sur un accès à null, remonté au client en
    // erreur interne (« Cannot read properties of null ») au lieu d'un refus
    // métier lisible.
    //
    // La lecture filtre aussi sur le créateur : demander une opération qui
    // appartient à quelqu'un d'autre est indistinguable d'une opération
    // inexistante, et c'est voulu.
    const existing = await this.inversify.bddService.getOperation({
      operation_id: dto.operation_id,
      user_id: dto.user_id,
    });

    if (!existing) {
      throw new Error(ERRORS.OPERATION_NOT_FOUND);
    }

    return await this.inversify.bddService.updateOperation(dto);
  }
}
