import { config } from '@src/config';
import { Inversify } from '@src/inversify/investify';

export class TestBddUsecase {

  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(): Promise<boolean> {
    this.inversify.loggerService.info('TestBddUsecase begin');
    this.inversify.loggerService.info(JSON.stringify(config.bdd));
    await this.inversify.bddService.test();
    this.inversify.loggerService.info('TestBddUsecase end');
    return true;
  }
}