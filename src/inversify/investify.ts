import { config } from '@src/config';
import { logger } from '@src/common/logger/logger';
import { BddService } from '@src/service/bdd/bdd.service';
import { GetUserUsecase } from '@src/usecase/getUser.usecase';
import { TestBddUsecase } from '@src/usecase/testBdd.usecase';
import { AuthUsecase } from '@src/usecase/auth.usecase.model';
import { CryptService } from '@src/service/crypt/crypt.service';
import { GetAccountUsecase } from '@usecase/getAccount.usecase';
import { BddServiceSQL } from '@src/service/bdd/bdd.service.sql';
import { GetAccountsUsecase } from '@usecase/getAccounts.usecase';
import { BddServiceFake } from '@src/service/bdd/bdd.service.fake';
import { CryptServiceReal } from '@service/crypt/crypt.service.real';
import { CreateAccountUsecase } from '@usecase/createAccount.usecase';
import { UpdateAccountUsecase } from '@usecase/updateAccount.usecase';
import { DeleteAccountUsecase } from '@usecase/deleteAccount.usecase';

export class Inversify {
  loggerService: any;
  bddService: BddService;
  cryptService: CryptService;

  authUsecase: AuthUsecase;
  testBddUsecase: TestBddUsecase;
  getUserUsecase: GetUserUsecase;
  getAccountUsecase: GetAccountUsecase;
  getAccountsUsecase: GetAccountsUsecase;
  createAccountUsecase: CreateAccountUsecase;
  updateAccountUsecase: UpdateAccountUsecase;
  deleteAccountUsecase: DeleteAccountUsecase;

  constructor() {
    this.cryptService = new CryptServiceReal();

    this.authUsecase = new AuthUsecase(this);
    this.testBddUsecase = new TestBddUsecase(this);
    this.getUserUsecase = new GetUserUsecase(this);
    this.getAccountUsecase = new GetAccountUsecase(this);
    this.getAccountsUsecase = new GetAccountsUsecase(this);
    this.createAccountUsecase = new CreateAccountUsecase(this);
    this.updateAccountUsecase = new UpdateAccountUsecase(this);
    this.deleteAccountUsecase = new DeleteAccountUsecase(this);

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