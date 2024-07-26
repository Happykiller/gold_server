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
import { AuthPasskeyUsecase } from '@usecase/auth/passkey.auth.usecase';
import { CloneOperationsUsecase } from '@usecase/cloneOperations.usecase';
import { DeleteOperationUsecase } from '@usecase/deleteOperation.usecase';
import { GetAccountTypesUsecase } from '@usecase/getAccountTypes.usecase';
import { UpdateOperationUsecase } from '@usecase/UpdateOperation.usecase';
import { CreateOperationUsecase } from '@usecase/createOperation.usecase';
import { GetOperationTypesUsecase } from '@usecase/getOperationTypes.usecase';
import { GetOperationLinksUsecase } from '@usecase/getOperationLinks.usecase';
import { DeletePasskeyUsecase } from '@usecase/passkey/delete.passkey.usecase';
import { CreatePasskeyUsecase } from '@usecase/passkey/create.passkey.usecase';
import { GetOperationStatusUsecase } from '@usecase/getOperationStatus.usecase';
import { GetOperationThridsUsecase } from '@usecase/getOperationThrids.usecase';
import { PasswordLessService } from '@service/passwordless/passwordless.service';
import { CreateOperationLinkUsecase } from '@usecase/createOperationLink.usecase';
import { DeleteOperationLinkUsecase } from '@usecase/deleteOperationLink.usecase';
import { GetOperationCategoriesUsecase } from '@usecase/getOperationCategories.usecase';
import { GetByUserIdPasskeyUsecase } from '@usecase/passkey/getByUserId.passkey.usecase';
import { PasswordLessServiceFake } from '@service/passwordless/passwordless.service.fake';
import { PasswordLessServiceReal } from '@service/passwordless/passwordlless.service.real';

export class Inversify {
  loggerService: any;
  bddService: BddService;
  cryptService: CryptService;

  authUsecase: AuthUsecase;
  testBddUsecase: TestBddUsecase;
  getUserUsecase: GetUserUsecase;
  getAccountUsecase: GetAccountUsecase;
  getAccountsUsecase: GetAccountsUsecase;
  authPasskeyUsecase: AuthPasskeyUsecase;
  getOperationUsecase: GetOperationUsecase;
  passwordLessService: PasswordLessService;
  getOperationsUsecase: GetOperationsUsecase;
  createAccountUsecase: CreateAccountUsecase;
  updateAccountUsecase: UpdateAccountUsecase;
  deleteAccountUsecase: DeleteAccountUsecase;
  deletePasskeyUsecase: DeletePasskeyUsecase;
  createPasskeyUsecase: CreatePasskeyUsecase;
  getAccountTypesUsecase: GetAccountTypesUsecase;
  createOperationUsecase: CreateOperationUsecase;
  updateOperationUsecase: UpdateOperationUsecase;
  deleteOperationUsecase: DeleteOperationUsecase;
  cloneOperationsUsecase: CloneOperationsUsecase;
  getOperationTypesUsecase: GetOperationTypesUsecase;
  getOperationLinksUsecase: GetOperationLinksUsecase;
  getByUserIdPasskeyUsecase: GetByUserIdPasskeyUsecase;
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
    this.authPasskeyUsecase = new AuthPasskeyUsecase(this);
    this.getAccountsUsecase = new GetAccountsUsecase(this);
    this.getOperationUsecase = new GetOperationUsecase(this);
    this.createAccountUsecase = new CreateAccountUsecase(this);
    this.updateAccountUsecase = new UpdateAccountUsecase(this);
    this.deleteAccountUsecase = new DeleteAccountUsecase(this);
    this.getOperationsUsecase = new GetOperationsUsecase(this);
    this.deletePasskeyUsecase = new DeletePasskeyUsecase(this);
    this.createPasskeyUsecase = new CreatePasskeyUsecase(this);
    this.cloneOperationsUsecase = new CloneOperationsUsecase(this);
    this.getAccountTypesUsecase = new GetAccountTypesUsecase(this);
    this.createOperationUsecase = new CreateOperationUsecase(this);
    this.updateOperationUsecase = new UpdateOperationUsecase(this);
    this.deleteOperationUsecase = new DeleteOperationUsecase(this);
    this.getOperationTypesUsecase = new GetOperationTypesUsecase(this);
    this.getOperationLinksUsecase = new GetOperationLinksUsecase(this);
    this.getOperationThridsUsecase = new GetOperationThridsUsecase(this);
    this.getOperationStatusUsecase = new GetOperationStatusUsecase(this);
    this.getByUserIdPasskeyUsecase = new GetByUserIdPasskeyUsecase(this);
    this.deleteOperationLinkUsecase = new DeleteOperationLinkUsecase(this);
    this.createOperationLinkUsecase = new CreateOperationLinkUsecase(this);
    this.getOperationCategoriesUsecase = new GetOperationCategoriesUsecase(this);

    if (config.env.mode === 'prod') {
      this.loggerService = logger;
      this.passwordLessService = new PasswordLessServiceReal();
      this.bddService = new BddServiceSQL();
    } else if (config.env.mode === 'dev') {
      this.loggerService = logger;
      this.passwordLessService = new PasswordLessServiceReal();
      this.bddService = new BddServiceFake();
    } else {
      this.loggerService = logger;
      this.passwordLessService = new PasswordLessServiceFake();
      this.bddService = new BddServiceFake();
    }
  }

}

const inversify = new Inversify();

export default inversify;