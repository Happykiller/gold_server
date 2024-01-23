/* istanbul ignore file */
import { BddService } from '@src/service/bdd/bdd.service';

export class BddServiceFake implements BddService {
  test(): Promise<boolean> {
    return Promise.resolve(true);
  }
}