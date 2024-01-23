/* istanbul ignore file */
import mysql from 'mysql2';

import { config } from '@src/config';
import { BddService } from '@src/service/bdd/bdd.service';

export class BddServiceSQL implements BddService {
  async test(): Promise<boolean> {
    const pool = mysql.createPool(config.bdd);

    const query = `SELECT 1;`;
    let response = await pool.execute(query);

    console.log(response);

    return Promise.resolve(true);
  }
}