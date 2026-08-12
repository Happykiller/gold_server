// src\service\bdd\mysql\db.service.passkey.mysql.ts
import { BddService } from '@service/bdd/bdd.service';
import PasskeyDbModel from '@happykiller/sunny-apis/dist/services/db/model/passkey.db.model';
import {
  CreatePasskeyDbDto,
  DeletePasskeyDbDto,
  GetPasskeyByUserIdDbDto,
  GetPasskeyDbDto,
} from '@happykiller/sunny-apis';

/**
 * Lit une colonne qui porte du JSON, sans supposer ce que le driver en a fait.
 *
 * Depuis mysql2 3.23, MariaDB annonce par ses métadonnées étendues les colonnes
 * qu'elle considère comme `JSON` — c'est-à-dire, chez elle, un `longtext` sous
 * `CHECK (json_valid(...))` — et le driver les **désérialise lui-même**. Le
 * `JSON.parse` qui suivait recevait alors un objet, le convertissait en
 * `"[object Object]"` et échouait : c'est ce qui a cassé les passkeys en
 * production le 07/08/2026, quand le lock est passé de mysql2 3.14 à 3.23 en
 * effet de bord d'une autre montée.
 *
 * Les deux colonnes de `passkeys` ne sont pas logées à la même enseigne :
 * `registration` porte la contrainte (donc objet), `registration_parsed` a été
 * ajoutée en `longtext` nu par `004-passkeys_2.0` (donc texte). Et le partage
 * s'inverserait sur une base reconstruite depuis `001-install`, qui pose la
 * contrainte sur les deux. D'où cette lecture tolérante plutôt qu'un choix
 * arbitré une fois pour toutes : elle est correcte quel que soit le DDL et
 * quelle que soit la version du driver.
 */
function lireJson<T>(valeur: unknown): T | null {
  if (valeur === null || valeur === undefined || valeur === '') return null;
  return typeof valeur === 'string' ? (JSON.parse(valeur) as T) : (valeur as T);
}

export class BddServicePasskeyMysql implements Pick<
  BddService,
  'createPasskey' | 'getPasskeyByUserId' | 'getPasskey'
> {
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
      AND a.user_id = ?
    ;`;
    let [results] = await this.pool.execute(query, [dto.user_id]);
    results = results.map((elt) => {
      return {
        ...elt,
        registration: lireJson(elt.registration),
        registrationParsed: lireJson(elt.registration_parsed),
      };
    });
    return results;
  }

  async getPasskey(dto: GetPasskeyDbDto): Promise<PasskeyDbModel> {
    // `credential_id` vient du client WebAuthn, et ce chemin est celui de la
    // connexion : il s'emprunte donc sans être authentifié. Interpolé dans le
    // texte de la requête, il ouvrait une injection SQL — d'où la liaison.
    let filter = 'AND false';
    const params: unknown[] = [];
    if (dto.passkey_id) {
      filter = 'AND a.id = ?';
      params.push(dto.passkey_id);
    } else if (dto.credential_id) {
      filter = 'AND a.registration LIKE ?';
      params.push(`%${dto.credential_id}%`);
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
    let [results] = await this.pool.execute(query, params);

    results = results.map((elt) => {
      return {
        ...elt,
        registration: lireJson(elt.registration),
        registrationParsed: lireJson(elt.registration_parsed),
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
