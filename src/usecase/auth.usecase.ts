import { Inversify } from '@src/inversify/investify';
import { AuthUsecaseDto } from '@usecase/dto/auth.usecase.dto';
import { UserUsecaseModel } from '@usecase/model/user.usecase.model';
import { UserSessionUsecaseModel } from '@usecase/model/userSession.usecase.model';

export class AuthUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: AuthUsecaseDto): Promise<UserSessionUsecaseModel> {
    const user:UserUsecaseModel = await this.inversify.getUserUsecase.execute({
      code: dto.login
    });

    const cryptPassword = this.inversify.cryptService.crypt({
      message: dto.password
    });

    if (user && user.password === cryptPassword && user.active) {
      return {
        id: user.id,
        code: user.code,
        name_first: user.name_first,
        name_last: user.name_last,
        description: user.description,
        mail: user.mail,
        creation: user.creation,
        modification: user.modification,
        language: user.language
      }
    } else {
      return null;
    }
  }
}