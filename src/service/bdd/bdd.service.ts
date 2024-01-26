import { UserServiceModel } from '@src/service/bdd/model/user.service.model';
import { GetUserServiceDto } from '@src/service/bdd/dto/getUser.service.dto';
import { AccountServiceModel } from '@service/bdd/model/account.service.model';
import { GetAccountServiceDto } from '@service/bdd/dto/getAccount.service.dto';
import { GetAccountsServiceDto } from '@service/bdd/dto/getAccounts.service.dto';
import { OperationServiceModel } from '@service/bdd/model/operation.service.model';
import { GetOperationServiceDto } from '@service/bdd/dto/getOperation.service.dto';
import { GetOperationsServiceDto } from '@service/bdd/dto/getOperations.service.dto';
import { CreateAccountServiceDto } from '@service/bdd/dto/createAccount.service.dto';
import { UpdateAccountServiceDto } from '@service/bdd/dto/updateAccount.service.dto';
import { DeleteAccountServiceDto } from '@service/bdd/dto/deleteAccount.service.dto';
import { AccountTypeServiceModel } from '@service/bdd/model/accountType.service.model';
import { CreateOperationServiceDto } from '@service/bdd/dto/createOperation.service.dto';
import { UpdateOperationServiceDto } from '@service/bdd/dto/updateOperation.service.dto';
import { DeleteOperationServiceDto } from '@service/bdd/dto/deleteOperation.service.dto';
import { GetOperationLinkServiceDto } from '@service/bdd/dto/getOperationLink.service.dto';
import { OperationLinkServiceModel } from '@service/bdd/model/operationLink.service.model';
import { OperationTypeServiceModel } from '@service/bdd/model/operationType.service.model';
import { OperationThridServiceModel } from '@service/bdd/model/operationThrid.service.model';
import { GetOperationLinksServiceDto } from '@service/bdd/dto/getOperationLinks.service.dto';
import { OperationStatutServiceModel } from '@service/bdd/model/operationStatut.service.model';
import { DeleteOperationLinkServiceDto } from '@service/bdd/dto/deleteOperationLink.service.dto';
import { CreateOperationLinkServiceDto } from '@service/bdd/dto/createOperationLink.service.dto';
import { OperationCategoryServiceModel } from '@service/bdd/model/operationCategory.service.model';

export interface BddService {
  test(): Promise<boolean>;

  getUser(dto: GetUserServiceDto): Promise<UserServiceModel>;

  createAccount(dto: CreateAccountServiceDto): Promise<AccountServiceModel>;
  getAccount(dto: GetAccountServiceDto): Promise<AccountServiceModel>;
  getAccounts(dto: GetAccountsServiceDto): Promise<AccountServiceModel[]>;
  updateAccount(dto: UpdateAccountServiceDto): Promise<AccountServiceModel>;
  deleteAccount(dto: DeleteAccountServiceDto): Promise<boolean>;

  getAccountTypes(): Promise<AccountTypeServiceModel[]>;

  createOperation(dto: CreateOperationServiceDto): Promise<OperationServiceModel>;
  getOperation(dto: GetOperationServiceDto): Promise<OperationServiceModel>;
  getOperations(dto: GetOperationsServiceDto): Promise<OperationServiceModel[]>;
  updateOperation(dto: UpdateOperationServiceDto): Promise<OperationServiceModel>;
  deleteOperation(dto: DeleteOperationServiceDto): Promise<boolean>;

  getOperationTypes(): Promise<OperationTypeServiceModel[]>;
  getOperationThrids(): Promise<OperationThridServiceModel[]>;
  getOperationStatus(): Promise<OperationStatutServiceModel[]>;
  getOperationCategories(): Promise<OperationCategoryServiceModel[]>;

  createOperationLink(dto: CreateOperationLinkServiceDto): Promise<OperationLinkServiceModel>;
  getOperationLink(dto: GetOperationLinkServiceDto): Promise<OperationLinkServiceModel>;
  getOperationLinks(dto: GetOperationLinksServiceDto): Promise<OperationLinkServiceModel[]>;
  deleteOperationLink(dto: DeleteOperationLinkServiceDto): Promise<boolean>;
}