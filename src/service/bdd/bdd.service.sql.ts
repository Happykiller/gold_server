/* istanbul ignore file */
import * as mysql from 'mysql2/promise';

import { config } from '@src/config';
import { BddService } from '@src/service/bdd/bdd.service';
import { UserServiceModel } from '@src/service/bdd/model/user.service.model';
import { GetUserServiceDto } from '@src/service/bdd/dto/getUser.service.dto';
import { ERRORS } from '../../common/ERROR';

export class BddServiceSQL implements BddService {

  pool: any;

  constructor() {
    this.pool = mysql.createPool({
      debug: false,
      ...config.bdd
    });
  }

  async test(): Promise<boolean> {
    const query = `SELECT 1;`;
    await this.pool.execute(query);
    return Promise.resolve(true);
  }

  async getUser(dto: GetUserServiceDto): Promise<UserServiceModel> {
    let filter;

    if(dto.code) {
      filter = `AND a.code = '${dto.code}'`;
    } else if (dto.id) {
      filter = `AND a.id = ${dto.id}`;
    } else {
      throw new Error(ERRORS.BDD_SERVICE_SQL_NO_FILTER);
    }

    const query = `SELECT id, code, password, name_first, name_last, description, mail, active, creation, modification, language
      FROM user a
      WHERE 1=1
      ${filter}
    ;`;
    const [results] = await this.pool.execute(query);

    if(results.length > 0) {
      return results[0];
    } else {
      return null;
    }
  }
}