import { UserServiceModel } from '@src/service/bdd/model/user.service.model';
import { GetUserServiceDto } from '@src/service/bdd/dto/getUser.service.dto';
import { AccountServiceModel } from '@service/bdd/model/account.service.model';
import { GetAccountServiceDto } from '@service/bdd/dto/getAccount.service.dto';
import { GetAccountsServiceDto } from '@service/bdd/dto/getAccounts.service.dto';
import { CreateAccountServiceDto } from '@service/bdd/dto/createAccount.service.dto';
import { UpdateAccountServiceDto } from '@service/bdd/dto/updateAccount.service.dto';
import { DeleteAccountServiceDto } from '@service/bdd/dto/deleteAccount.service.dto';

export interface BddService {
  test(): Promise<boolean>;
  getUser(dto: GetUserServiceDto): Promise<UserServiceModel>;
  getAccount(dto: GetAccountServiceDto): Promise<AccountServiceModel>;
  getAccounts(dto: GetAccountsServiceDto): Promise<AccountServiceModel[]>;
  createAccount(dto: CreateAccountServiceDto): Promise<AccountServiceModel>;
  updateAccount(dto: UpdateAccountServiceDto): Promise<AccountServiceModel>;
  deleteAccount(dto: DeleteAccountServiceDto): Promise<boolean>;
}