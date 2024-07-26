import { Inversify } from '@src/inversify/investify';
import PasskeyUsecaseModel from '@usecase/passkey/model/passkey.usecase.model';
import GetByUserIdPasskeyUsecaseDto from '@usecase/passkey/dto/getByUserId.passkey.usecase.dto';

export class GetByUserIdPasskeyUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  execute(dto: GetByUserIdPasskeyUsecaseDto): Promise<PasskeyUsecaseModel[]> {
    return this.inversify.bddService.getPasskeyByUserId(dto);
  }
}
