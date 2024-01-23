import { BddService } from '../service/bdd/bdd.service';
import { config } from '@src/config';
import { logger } from '@src/common/logger/logger';
import { BddServiceSQL } from '../service/bdd/bdd.service.sql';
import { BddServiceFake } from '../service/bdd/bdd.service.fake';
import { TestBddUsecase } from '../usecase/testBdd.usecase';

export class Inversify {
  testBddUsecase: TestBddUsecase;
  loggerService: any;
  bddService: BddService;

  constructor() {
    this.testBddUsecase = new TestBddUsecase(this);
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