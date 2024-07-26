import { Inversify } from '@src/inversify/investify';
import PasskeyUsecaseModel from '@usecase/passkey/model/passkey.usecase.model';
import CreatePasskeyUsecaseDto from '@usecase/passkey/dto/create.passkey.usecase.dto';

export class CreatePasskeyUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  execute(dto: CreatePasskeyUsecaseDto): Promise<PasskeyUsecaseModel> {
    return this.inversify.bddService.createPasskey(dto);
  }
}
