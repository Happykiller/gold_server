// src\service\bdd\fake\bdd.service.account.fake.ts
import { AccountServiceModel } from '@service/bdd/model/account.service.model';
import { GetAccountServiceDto } from '@service/bdd/dto/getAccount.service.dto';
import { GetAccountsServiceDto } from '@service/bdd/dto/getAccounts.service.dto';
import { CreateAccountServiceDto } from '@service/bdd/dto/createAccount.service.dto';
import { UpdateAccountServiceDto } from '@service/bdd/dto/updateAccount.service.dto';
import { DeleteAccountServiceDto } from '@service/bdd/dto/deleteAccount.service.dto';
import { AccountTypeServiceModel } from '@service/bdd/model/accountType.service.model';

export class BddServiceAccountFake {
  collectionAccount:AccountServiceModel[] = [{
    id: 1,
    type_id: 1,
    parent_account_id: null,
    label: 'Account',
    description: 'Account fake',
    balance_reconcilied: 41,
    balance_not_reconcilied: 42,
    active: true,
    creator_id: 1,
    creation_date: (new Date()).getTime().toString(),
    modificator_id: null,
    modification_date: (new Date()).getTime().toString(),
  }];
  
  getAccounts(dto: GetAccountsServiceDto): Promise<AccountServiceModel[]> {
    return Promise.resolve(this.collectionAccount);
  }
  
  getAccount(dto: GetAccountServiceDto): Promise<AccountServiceModel> {
    return Promise.resolve(this.collectionAccount.find(elt => elt.id === dto.account_id));
  }
  
  createAccount(dto: CreateAccountServiceDto): Promise<AccountServiceModel> {
    const elt:AccountServiceModel = {
      id: (this.collectionAccount.length++ - 1),
      type_id: dto.type_id,
      parent_account_id: dto.parent_account_id,
      label: dto.label,
      description: dto.description,
      balance_reconcilied: 41,
      balance_not_reconcilied: 42,
      active: true,
      creator_id: dto.user_id,
      creation_date: (new Date()).getTime().toString(),
      modificator_id: null,
      modification_date: null
    };

    this.collectionAccount.push(elt);

    return Promise.resolve(elt);
  }

  async updateAccount(dto: UpdateAccountServiceDto): Promise<AccountServiceModel> {
    let elt:AccountServiceModel = await this.getAccount(dto);
    let objIndex = this.collectionAccount.findIndex((obj => obj.id == dto.account_id));

    const input = dto;
    delete input.user_id;

    elt = {
      ...elt,
      ...input,
      modificator_id: dto.user_id,
      modification_date: (new Date()).getTime().toString()
    }

    this.collectionAccount[objIndex] = elt;

    return Promise.resolve(elt);
  }

  async deleteAccount(dto: DeleteAccountServiceDto): Promise<boolean> {
    let elt = this.collectionAccount.find((obj => obj.id == dto.account_id));

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