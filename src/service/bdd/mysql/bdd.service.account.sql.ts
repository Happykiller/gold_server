// src\service\bdd\bdd.service.sql.ts
import { AccountServiceModel } from '@service/bdd/model/account.service.model';
import { GetAccountServiceDto } from '@service/bdd/dto/getAccount.service.dto';
import { GetAccountsServiceDto } from '@service/bdd/dto/getAccounts.service.dto';
import { CreateAccountServiceDto } from '@service/bdd/dto/createAccount.service.dto';
import { UpdateAccountServiceDto } from '@service/bdd/dto/updateAccount.service.dto';
import { DeleteAccountServiceDto } from '@service/bdd/dto/deleteAccount.service.dto';
import { AccountTypeServiceModel } from '@service/bdd/model/accountType.service.model';

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

  async getAccounts(dto: GetAccountsServiceDto): Promise<AccountServiceModel[]> {
    const query = `SELECT id, 
        type_id, 
        parent_account_id, 
        label, 
        description,
        getBalance(a.id, true) as balance_reconcilied,
        getBalance(a.id, false) as balance_not_reconcilied,
        creator_id, 
        creation_date, 
        modificator_id, 
        modification_date
      FROM account a
      WHERE 1=1
      AND a.active = 1
      AND a.creator_id = ${dto.user_id}
    ;`;
    const [results] = await this.pool.execute(query);
    return results;
  }

  async getAccount(dto: GetAccountServiceDto): Promise<AccountServiceModel> {
    const query = `SELECT id, 
        type_id, 
        parent_account_id, 
        label, 
        description,
        getBalance(a.id, true) as balance_reconcilied,
        getBalance(a.id, false) as balance_not_reconcilied,
        creator_id, 
        creation_date, 
        modificator_id, 
        modification_date
      FROM account a
      WHERE 1=1
      AND a.active = 1
      AND a.id = ${dto.account_id}
      AND a.creator_id = ${dto.user_id}
    ;`;
    const [results] = await this.pool.execute(query);
    if(results.length > 0) {
      return results[0];
    } else {
      return null;
    }
  }

  async createAccount(dto: CreateAccountServiceDto): Promise<AccountServiceModel> {
    const query = `INSERT INTO account (type_id, parent_account_id, label, description, creator_id)
    VALUES (?, ?, ?, ?, ?)
    ;`;
    const [results] = await this.pool.execute(query, [dto.type_id, (dto.parent_account_id)?dto.parent_account_id:null, dto.label, (dto.description)?dto.description:null, dto.user_id]);
    return await this.getAccount({
      account_id: results.insertId,
      user_id: dto.user_id
    });
  }

  async updateAccount(dto: UpdateAccountServiceDto): Promise<AccountServiceModel> {
    const old:AccountServiceModel = await this.getAccount(dto);
    const query = `UPDATE account SET
      type_id = ?,
      parent_account_id = ?,
      label = ?,
      description = ?,
      modificator_id = ?,
      modification_date = ?
    WHERE 1=1
      AND id = ?
    ;`;
    const [results] = await this.pool.execute(query, [
      (dto.type_id)?dto.type_id:old.type_id, 
      (dto.parent_account_id)?dto.parent_account_id:old.parent_account_id, 
      (dto.label)?dto.label:old.label, 
      (dto.description)?dto.description:old.type_id, 
      dto.user_id,
      'now',
      dto.account_id
    ]);
    return await this.getAccount({
      account_id: results.updateId,
      user_id: dto.user_id
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
    const [results] = await this.pool.execute(query, [
      dto.user_id,
      'now',
      dto.account_id
    ]);
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