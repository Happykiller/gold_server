import { UserServiceModel } from '@src/service/bdd/model/user.service.model';
import { GetUserServiceDto } from '@src/service/bdd/dto/getUser.service.dto';
import { AccountServiceModel } from '@service/bdd/model/account.service.model';
import { GetAccountServiceDto } from '@service/bdd/dto/getAccount.service.dto';
import { GetAccountsServiceDto } from '@service/bdd/dto/getAccounts.service.dto';
import { CreateAccountServiceDto } from '@service/bdd/dto/createAccount.service.dto';
import { UpdateAccountServiceDto } from '@service/bdd/dto/updateAccount.service.dto';
import { DeleteAccountServiceDto } from '@service/bdd/dto/deleteAccount.service.dto';
import { AccountTypeServiceModel } from '@service/bdd/model/accountType.service.model';

export interface BddService {
  test(): Promise<boolean>;
  getAccountTypes(): Promise<AccountTypeServiceModel[]>;
  getUser(dto: GetUserServiceDto): Promise<UserServiceModel>;
  deleteAccount(dto: DeleteAccountServiceDto): Promise<boolean>;
  getAccount(dto: GetAccountServiceDto): Promise<AccountServiceModel>;
  getAccounts(dto: GetAccountsServiceDto): Promise<AccountServiceModel[]>;
  createAccount(dto: CreateAccountServiceDto): Promise<AccountServiceModel>;
  updateAccount(dto: UpdateAccountServiceDto): Promise<AccountServiceModel>;
}