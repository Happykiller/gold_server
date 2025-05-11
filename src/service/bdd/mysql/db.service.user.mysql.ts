// src\service\bdd\mysql\db.service.passkey.mysql.ts
import { ERRORS } from '@src/common/ERROR';
import { BddService } from '@service/bdd/bdd.service';
import { GetUserDbDto, UserDbModel, } from '@happykiller/sunny-apis';

export class BddServiceUserMysql
  implements
  Pick<BddService, 'getUser'> {

  pool: any;

  async getUser(dto: GetUserDbDto): Promise<UserDbModel> {
    let filter;

    if (dto.code) {
      filter = `AND a.code = '${dto.code}'`;
    } else if (dto.id) {
      filter = `AND a.id = ${dto.id}`;
    } else {
      throw new Error(ERRORS.BDD_SERVICE_SQL_NO_FILTER);
    }

    const query = `SELECT id, code, password, name_first, name_last, description, mail, active, creation, modification, language, role
        FROM user a
        WHERE 1=1
        ${filter}
      ;`;
    const [results] = await this.pool.execute(query);

    if (results.length > 0) {
      return results[0];
    } else {
      return null;
    }
  }
}
