import { Inversify } from '@src/inversify/investify';
import DeletePasskeyUsecaseDto from '@usecase/passkey/dto/delete.passkey.usecase.dto';

export class DeletePasskeyUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  execute(dto: DeletePasskeyUsecaseDto): Promise<boolean> {
    return this.inversify.bddService.deletePasskey(dto);
  }
}
