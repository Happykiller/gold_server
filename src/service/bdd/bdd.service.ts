import { UserServiceModel } from '@src/service/bdd/model/user.service.model';
import { GetUserServiceDto } from '@src/service/bdd/dto/getUser.service.dto';

export interface BddService {
  test(): Promise<boolean>;
  getUser(dto: GetUserServiceDto): Promise<UserServiceModel>;
}