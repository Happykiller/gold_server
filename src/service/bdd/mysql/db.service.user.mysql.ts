// src\service\bdd\mysql\db.service.user.mysql.ts
import { ERRORS } from '@src/common/ERROR';
import { BddService } from '@service/bdd/bdd.service';
import { GetUserDbDto, UserDbModel } from '@happykiller/sunny-apis';

export class BddServiceUserMysql implements Pick<BddService, 'getUser'> {
  pool: any;

  async getUser(dto: GetUserDbDto): Promise<UserDbModel> {
    // `code` est le login saisi à la connexion, et `auth` n'a pas de garde
    // d'authentification : c'est la requête la plus exposée du serveur. Elle
    // interpolait sa valeur dans le texte SQL — d'où les liaisons.
    let filter;
    const params: unknown[] = [];

    if (dto.code) {
      filter = 'AND a.code = ?';
      params.push(dto.code);
    } else if (dto.id) {
      filter = 'AND a.id = ?';
      params.push(dto.id);
    } else {
      throw new Error(ERRORS.BDD_SERVICE_SQL_NO_FILTER);
    }

    const query = `SELECT id, code, password, name_first, name_last, description, mail, active, creation, modification, language, role
        FROM user a
        WHERE 1=1
        ${filter}
      ;`;
    const [results] = await this.pool.execute(query, params);

    if (results.length > 0) {
      return results[0];
    } else {
      return null;
    }
  }
}
