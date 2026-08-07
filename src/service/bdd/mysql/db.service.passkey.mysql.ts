// src\service\bdd\mysql\db.service.passkey.mysql.ts
import { BddService } from '@service/bdd/bdd.service';
import PasskeyDbModel from '@happykiller/sunny-apis/dist/services/db/model/passkey.db.model';
import {
  CreatePasskeyDbDto,
  DeletePasskeyDbDto,
  GetPasskeyByUserIdDbDto,
  GetPasskeyDbDto,
} from '@happykiller/sunny-apis';

export class BddServicePasskeyMysql
  implements
    Pick<BddService, 'createPasskey' | 'getPasskeyByUserId' | 'getPasskey'>
{
  pool: any;

  async createPasskey(dto: CreatePasskeyDbDto): Promise<PasskeyDbModel> {
    const query = `INSERT INTO passkeys (user_id, user_code, label, hostname, challenge, registration, registration_parsed) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ;`;
    const [results] = await this.pool.execute(query, [
      dto.user_id,
      dto.user_code,
      dto.label,
      dto.hostname,
      dto.challenge,
      JSON.stringify(dto.registration),
      JSON.stringify(dto.registrationParsed),
    ]);
    return await this.getPasskey({
      passkey_id: results.insertId,
    });
  }

  async getPasskeyByUserId(
    dto: GetPasskeyByUserIdDbDto,
  ): Promise<PasskeyDbModel[]> {
    const query = `SELECT id, 
        user_id, 
        user_code, 
        label, 
        hostname,
        challenge,
        registration,
        registration_parsed
      FROM passkeys a
      WHERE 1=1
      and a.active = 1
      AND a.user_id = ${dto.user_id}
    ;`;
    let [results] = await this.pool.execute(query);
    results = results.map((elt) => {
      return {
        ...elt,
        registration: JSON.parse(elt.registration),
        registrationParsed: JSON.parse(
          !elt.registration_parsed || elt.registration_parsed === ''
            ? null
            : elt.registration_parsed,
        ),
      };
    });
    return results;
  }

  async getPasskey(dto: GetPasskeyDbDto): Promise<PasskeyDbModel> {
    let filter = 'AND false';
    if (dto.passkey_id) {
      filter = `AND a.id = ${dto.passkey_id}`;
    } else if (dto.credential_id) {
      filter = `AND a.registration like '%${dto.credential_id}%'`;
    }

    const query = `SELECT id, 
        user_id, 
        user_code, 
        label, 
        hostname,
        challenge,
        registration,
        registration_parsed
      FROM passkeys a
      WHERE 1=1
      AND a.active = 1
      ${filter}
    ;`;
    let [results] = await this.pool.execute(query);

    results = results.map((elt) => {
      return {
        ...elt,
        registration: JSON.parse(elt.registration),
        registrationParsed: JSON.parse(elt.registration_parsed),
      };
    });

    if (results.length > 0) {
      return results[0];
    } else {
      return null;
    }
  }

  async deletePasskey(dto: DeletePasskeyDbDto): Promise<boolean> {
    const query = `UPDATE passkeys SET
      active = 0
    WHERE 1=1
      AND id = ?
      AND active = 1
    ;`;
    await this.pool.execute(query, [dto.passkey_id]);
    return true;
  }
}
