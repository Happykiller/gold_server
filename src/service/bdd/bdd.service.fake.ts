/* istanbul ignore file */
import { BddService } from '@src/service/bdd/bdd.service';
import { UserServiceModel } from '@src/service/bdd/model/user.service.model';
import { GetUserServiceDto } from '@src/service/bdd/dto/getUser.service.dto';

export class BddServiceFake implements BddService {
  getUser(_dto: GetUserServiceDto): Promise<UserServiceModel> {
    return Promise.resolve({
      id: 1,
      code: 'ropo',
      password: 'password',
      name_first: 'Robert',
      name_last: 'Paulson',
      description: 'His name is Robert Paulson',
      mail: 'r.paulson@bob.com',
      active: true,
      creation: '2024-01-24 07:46:01',
      modification: null,
      language: 'fr',
    });
  }
  test(): Promise<boolean> {
    return Promise.resolve(true);
  }
}