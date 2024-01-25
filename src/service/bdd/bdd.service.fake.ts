/* istanbul ignore file */
import { BddService } from '@src/service/bdd/bdd.service';
import { UserServiceModel } from '@src/service/bdd/model/user.service.model';
import { GetUserServiceDto } from '@src/service/bdd/dto/getUser.service.dto';
import { AccountServiceModel } from '@src/service/bdd/model/account.service.model';
import { GetAccountServiceDto } from '@src/service/bdd/dto/getAccount.service.dto';
import { GetAccountsServiceDto } from '@src/service/bdd/dto/getAccounts.service.dto';
import { CreateAccountServiceDto } from '@service/bdd/dto/createAccount.service.dto';
import { UpdateAccountServiceDto } from '@service/bdd/dto/updateAccount.service.dto';
import { DeleteAccountServiceDto } from '@service/bdd/dto/deleteAccount.service.dto';
import { AccountTypeServiceModel } from '@service/bdd/model/accountType.service.model';

export class BddServiceFake implements BddService {

  collection:AccountServiceModel[] = [{
    id: 1,
    type_id: 1,
    parent_account_id: null,
    label: 'Account',
    description: 'Account fake',
    active: true,
    creator_id: 1,
    creation_date: (new Date()).getTime().toString(),
    modificator_id: null,
    modification_date: (new Date()).getTime().toString(),
  }];

  test(): Promise<boolean> {
    return Promise.resolve(true);
  }

  getUser(_dto: GetUserServiceDto): Promise<UserServiceModel> {
    return Promise.resolve({
      id: 1,
      code: 'ropo',
      password: 'WV5FXp063tPBcccZbqAHH0B93s2Wzf/nTXu8UaU2TeCMh+F0OsXUX02HNsI1Ytd2yowsT707bKCV0KC5uA0usQ==',
      name_first: 'Robert',
      name_last: 'Paulson',
      description: 'His name is Robert Paulson',
      mail: 'r.paulson@bob.com',
      active: true,
      creation: (new Date()).getTime().toString(),
      modification: null,
      language: 'fr'
    });
  }
  
  getAccounts(dto: GetAccountsServiceDto): Promise<AccountServiceModel[]> {
    return Promise.resolve(this.collection);
  }
  
  getAccount(dto: GetAccountServiceDto): Promise<AccountServiceModel> {
    return Promise.resolve(this.collection.find(elt => elt.id === dto.account_id));
  }
  
  createAccount(dto: CreateAccountServiceDto): Promise<AccountServiceModel> {
    const elt:AccountServiceModel = {
      id: (this.collection.length++ - 1),
      type_id: dto.type_id,
      parent_account_id: dto.parent_account_id,
      label: dto.label,
      description: dto.description,
      active: true,
      creator_id: dto.user_id,
      creation_date: (new Date()).getTime().toString(),
      modificator_id: null,
      modification_date: null
    };

    this.collection.push(elt);

    return Promise.resolve(elt);
  }

  async updateAccount(dto: UpdateAccountServiceDto): Promise<AccountServiceModel> {
    let elt:AccountServiceModel = await this.getAccount(dto);
    let objIndex = this.collection.findIndex((obj => obj.id == dto.account_id));

    const input = dto;
    delete input.user_id;

    elt = {
      ...elt,
      ...input,
      modificator_id: dto.user_id,
      modification_date: (new Date()).getTime().toString()
    }

    this.collection[objIndex] = elt;

    return Promise.resolve(elt);
  }

  async deleteAccount(dto: DeleteAccountServiceDto): Promise<boolean> {
    let elt = this.collection.find((obj => obj.id == dto.account_id));

    elt.active = false;
    elt.modificator_id = dto.user_id;
    elt.modification_date = (new Date()).getTime().toString();

    return Promise.resolve(true);
  }

  getAccountTypes(): Promise<AccountTypeServiceModel[]> {
    return Promise.resolve([{
      id: 1,
      label: 'account.type-regular',
      description: 'description',
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null
    },{
      id: 2,
      label: 'account.type-template',
      description: 'description',
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null
    }]);
  }
}