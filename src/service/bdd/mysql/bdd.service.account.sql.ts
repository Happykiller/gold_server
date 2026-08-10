// src\service\bdd\bdd.service.sql.ts
import { AccountServiceModel } from '@service/bdd/model/account.service.model';
import { GetAccountServiceDto } from '@service/bdd/dto/getAccount.service.dto';
import { GetAccountsServiceDto } from '@service/bdd/dto/getAccounts.service.dto';
import { CreateAccountServiceDto } from '@service/bdd/dto/createAccount.service.dto';
import { UpdateAccountServiceDto } from '@service/bdd/dto/updateAccount.service.dto';
import { DeleteAccountServiceDto } from '@service/bdd/dto/deleteAccount.service.dto';
import { AccountTypeServiceModel } from '@service/bdd/model/accountType.service.model';
import { AccountBalanceServiceModel } from '@service/bdd/model/accountBalance.service.model';

export class BddServiceAccountSQL {
  pool: any;

  constructor(pool: any) {
    this.pool = pool;
  }

  async test(): Promise<boolean> {
    const query = `SELECT 1;`;
    await this.pool.execute(query);
    return Promise.resolve(true);
  }

  /**
   * Les deux soldes ne sont PLUS sélectionnés ici.
   *
   * `getBalance()` balaie tout l'historique du compte, sans borne de date, et
   * il était appelé deux fois par ligne de `account` — donc, via le resolver
   * `account` d'une opération, une fois par ligne de liste : 132 exécutions
   * pour afficher 50 opérations, soit ~1,3 million de lignes lues. Mesuré le
   * 10/08/2026 : ~145 ms par appel sous charge, et 2,1 s de bout en bout en
   * production sur le compte le plus chargé.
   *
   * Les soldes sont désormais résolus par `AccountFieldsResolver`, donc
   * uniquement quand le client les demande — ce que la liste ne fait pas.
   */
  async getAccounts(
    dto: GetAccountsServiceDto,
  ): Promise<AccountServiceModel[]> {
    const query = `SELECT id,
        type_id,
        parent_account_id,
        label,
        description,
        creator_id,
        creation_date,
        modificator_id,
        modification_date
      FROM account a
      WHERE 1=1
      AND a.active = 1
      AND a.creator_id = ?
    ;`;
    const [results] = await this.pool.execute(query, [dto.user_id]);
    return results;
  }

  async getAccount(dto: GetAccountServiceDto): Promise<AccountServiceModel> {
    const query = `SELECT id,
        type_id,
        parent_account_id,
        label,
        description,
        creator_id,
        creation_date,
        modificator_id,
        modification_date
      FROM account a
      WHERE 1=1
      AND a.active = 1
      AND a.id = ?
      AND a.creator_id = ?
    ;`;
    const [results] = await this.pool.execute(query, [
      dto.account_id,
      dto.user_id,
    ]);
    if (results.length > 0) {
      return results[0];
    } else {
      return null;
    }
  }

  /**
   * Les deux soldes de tous les comptes de l'utilisateur, en UNE requête.
   *
   * Reproduit exactement la sémantique de la fonction SQL `getBalance`
   * (`src/migration/001-install/002-function/do.sql`) :
   *
   *   - opérations émises par le compte : crédit (type 1) additionné, débit
   *     (2) et virement (3) retranchés, tout autre type ignoré — le `CASE`
   *     d'origine rend NULL, et `SUM` écarte les NULL ;
   *   - virements reçus (`account_id_dest`), comptés positivement, et
   *     seulement lorsqu'ils viennent d'un compte de type 1 ;
   *   - `balance_reconcilied` ne retient que le statut 2, l'autre solde les
   *     statuts 1 et 2 — malgré son nom, `balance_not_reconcilied` est le
   *     solde **projeté**, pointé compris.
   *
   * Comme `getBalance`, l'agrégat ne filtre pas les opérations sur leur
   * `creator_id` : le cloisonnement vient des comptes retenus, exactement
   * comme le `WHERE` qui entourait les appels à la fonction.
   *
   * Équivalence vérifiée le 10/08/2026 sur les 31 comptes du dump de
   * production : aucun écart, au centime.
   */
  async getAccountsBalances(
    dto: GetAccountsServiceDto,
  ): Promise<AccountBalanceServiceModel[]> {
    const query = `SELECT acc.id AS account_id,
        IFNULL(SUM(CASE WHEN m.status_id = 2 THEN m.move END), 0) AS balance_reconcilied,
        IFNULL(SUM(m.move), 0) AS balance_not_reconcilied
      FROM account acc
      LEFT JOIN (
        SELECT a.account_id AS account_id,
               a.status_id,
               CASE a.type_id
                 WHEN 1 THEN a.amount
                 WHEN 2 THEN -a.amount
                 WHEN 3 THEN -a.amount
               END AS move
          FROM operation a
         WHERE a.active = 1
           AND a.status_id IN (1, 2)
        UNION ALL
        SELECT a.account_id_dest AS account_id,
               a.status_id,
               a.amount AS move
          FROM operation a
          JOIN account b ON b.id = a.account_id AND b.type_id = 1
         WHERE a.active = 1
           AND a.status_id IN (1, 2)
           AND a.account_id_dest IS NOT NULL
      ) m ON m.account_id = acc.id
      WHERE acc.active = 1
        AND acc.creator_id = ?
      GROUP BY acc.id
    ;`;
    const [results] = await this.pool.execute(query, [dto.user_id]);
    return results;
  }

  async createAccount(
    dto: CreateAccountServiceDto,
  ): Promise<AccountServiceModel> {
    const query = `INSERT INTO account (type_id, parent_account_id, label, description, creator_id)
    VALUES (?, ?, ?, ?, ?)
    ;`;
    const [results] = await this.pool.execute(query, [
      dto.type_id,
      dto.parent_account_id ? dto.parent_account_id : null,
      dto.label,
      dto.description ? dto.description : null,
      dto.user_id,
    ]);
    return await this.getAccount({
      account_id: results.insertId,
      user_id: dto.user_id,
    });
  }

  async updateAccount(
    dto: UpdateAccountServiceDto,
  ): Promise<AccountServiceModel> {
    const old: AccountServiceModel = await this.getAccount(dto);
    const query = `UPDATE account SET
      type_id = ?,
      parent_account_id = ?,
      label = ?,
      description = ?,
      modificator_id = ?,
      modification_date = current_date()
    WHERE 1=1
      AND id = ?
    ;`;
    await this.pool.execute(query, [
      dto.type_id ? dto.type_id : old.type_id,
      dto.parent_account_id ? dto.parent_account_id : old.parent_account_id,
      dto.label ? dto.label : old.label,
      dto.description ? dto.description : old.description,
      dto.user_id,
      dto.account_id,
    ]);
    return await this.getAccount({
      account_id: dto.account_id,
      user_id: dto.user_id,
    });
  }

  async deleteAccount(dto: DeleteAccountServiceDto): Promise<boolean> {
    const query = `UPDATE account SET
      active = 0,
      modificator_id = ?,
      modification_date = ?
    WHERE 1=1
      AND id = ?
      AND active = 1
    ;`;
    await this.pool.execute(query, [dto.user_id, 'now', dto.account_id]);
    return true;
  }

  async getAccountTypes(): Promise<AccountTypeServiceModel[]> {
    const query = `SELECT id,
        label, 
        description, 
        creator_id, 
        creation_date, 
        modificator_id, 
        modification_date
      FROM account_type_list a
      WHERE 1=1
      AND a.active = 1
    ;`;
    const [results] = await this.pool.execute(query);
    return results;
  }
}
