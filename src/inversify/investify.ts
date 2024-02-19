/* istanbul ignore file */
import { config } from '@src/config';
import { logger } from '@src/common/logger/logger';
import { AuthUsecase } from '@src/usecase/auth.usecase';
import { BddService } from '@src/service/bdd/bdd.service';
import { GetUserUsecase } from '@src/usecase/getUser.usecase';
import { TestBddUsecase } from '@src/usecase/testBdd.usecase';
import { CryptService } from '@src/service/crypt/crypt.service';
import { GetAccountUsecase } from '@usecase/getAccount.usecase';
import { BddServiceSQL } from '@src/service/bdd/bdd.service.sql';
import { GetAccountsUsecase } from '@usecase/getAccounts.usecase';
import { BddServiceFake } from '@src/service/bdd/bdd.service.fake';
import { GetOperationUsecase } from '@usecase/getOperation.usecase';
import { CryptServiceReal } from '@service/crypt/crypt.service.real';
import { GetOperationsUsecase } from '@usecase/getOperations.usecase';
import { CreateAccountUsecase } from '@usecase/createAccount.usecase';
import { UpdateAccountUsecase } from '@usecase/updateAccount.usecase';
import { DeleteAccountUsecase } from '@usecase/deleteAccount.usecase';
import { CloneOperationsUsecase } from '@usecase/cloneOperations.usecase';
import { DeleteOperationUsecase } from '@usecase/deleteOperation.usecase';
import { GetAccountTypesUsecase } from '@usecase/getAccountTypes.usecase';
import { UpdateOperationUsecase } from '@usecase/UpdateOperation.usecase';
import { CreateOperationUsecase } from '@usecase/createOperation.usecase';
import { GetOperationTypesUsecase } from '@usecase/getOperationTypes.usecase';
import { GetOperationLinksUsecase } from '@usecase/getOperationLinks.usecase';
import { GetOperationStatusUsecase } from '@usecase/getOperationStatus.usecase';
import { GetOperationThridsUsecase } from '@usecase/getOperationThrids.usecase';
import { CreateOperationLinkUsecase } from '@usecase/createOperationLink.usecase';
import { DeleteOperationLinkUsecase } from '@usecase/deleteOperationLink.usecase';
import { GetOperationCategoriesUsecase } from '@usecase/getOperationCategories.usecase';

export class Inversify {
  loggerService: any;
  bddService: BddService;
  cryptService: CryptService;

  authUsecase: AuthUsecase;
  testBddUsecase: TestBddUsecase;
  getUserUsecase: GetUserUsecase;
  getAccountUsecase: GetAccountUsecase;
  getAccountsUsecase: GetAccountsUsecase;
  getOperationUsecase: GetOperationUsecase;
  getOperationsUsecase: GetOperationsUsecase;
  createAccountUsecase: CreateAccountUsecase;
  updateAccountUsecase: UpdateAccountUsecase;
  deleteAccountUsecase: DeleteAccountUsecase;
  getAccountTypesUsecase: GetAccountTypesUsecase;
  createOperationUsecase: CreateOperationUsecase;
  updateOperationUsecase: UpdateOperationUsecase;
  deleteOperationUsecase: DeleteOperationUsecase;
  cloneOperationsUsecase: CloneOperationsUsecase;
  getOperationTypesUsecase: GetOperationTypesUsecase;
  getOperationLinksUsecase: GetOperationLinksUsecase;
  getOperationThridsUsecase: GetOperationThridsUsecase;
  getOperationStatusUsecase: GetOperationStatusUsecase;
  deleteOperationLinkUsecase: DeleteOperationLinkUsecase;
  createOperationLinkUsecase: CreateOperationLinkUsecase;
  getOperationCategoriesUsecase: GetOperationCategoriesUsecase;

  constructor() {
    this.cryptService = new CryptServiceReal();

    this.authUsecase = new AuthUsecase(this);
    this.testBddUsecase = new TestBddUsecase(this);
    this.getUserUsecase = new GetUserUsecase(this);
    this.getAccountUsecase = new GetAccountUsecase(this);
    this.getAccountsUsecase = new GetAccountsUsecase(this);
    this.getOperationUsecase = new GetOperationUsecase(this);
    this.createAccountUsecase = new CreateAccountUsecase(this);
    this.updateAccountUsecase = new UpdateAccountUsecase(this);
    this.deleteAccountUsecase = new DeleteAccountUsecase(this);
    this.getOperationsUsecase = new GetOperationsUsecase(this);
    this.cloneOperationsUsecase = new CloneOperationsUsecase(this);
    this.getAccountTypesUsecase = new GetAccountTypesUsecase(this);
    this.createOperationUsecase = new CreateOperationUsecase(this);
    this.updateOperationUsecase = new UpdateOperationUsecase(this);
    this.deleteOperationUsecase = new DeleteOperationUsecase(this);
    this.getOperationTypesUsecase = new GetOperationTypesUsecase(this);
    this.getOperationLinksUsecase = new GetOperationLinksUsecase(this);
    this.getOperationThridsUsecase = new GetOperationThridsUsecase(this);
    this.getOperationStatusUsecase = new GetOperationStatusUsecase(this);
    this.deleteOperationLinkUsecase = new DeleteOperationLinkUsecase(this);
    this.createOperationLinkUsecase = new CreateOperationLinkUsecase(this);
    this.getOperationCategoriesUsecase = new GetOperationCategoriesUsecase(this);

    if (config.env.mode === 'prod') {
      this.loggerService = logger;
      this.bddService = new BddServiceSQL();
    } else if (config.env.mode === 'dev') {
      this.loggerService = logger;
      this.bddService = new BddServiceFake();
    } else {
      this.loggerService = logger;
      this.bddService = new BddServiceFake();
    }
  }

}

const inversify = new Inversify();

export default inversify;