/* istanbul ignore file */
import * as mysql from 'mysql2/promise';

import { config } from '@src/config';
import { ERRORS } from '@src/common/ERROR';
import { BddService } from '@src/service/bdd/bdd.service';
import { AccountTypeServiceModel } from './model/accountType.service.model';
import { UserServiceModel } from '@src/service/bdd/model/user.service.model';
import { GetUserServiceDto } from '@src/service/bdd/dto/getUser.service.dto';
import { AccountServiceModel } from '@src/service/bdd/model/account.service.model';
import { GetAccountServiceDto } from '@src/service/bdd/dto/getAccount.service.dto';
import { GetAccountsServiceDto } from '@src/service/bdd/dto/getAccounts.service.dto';
import { CreateAccountServiceDto } from '@service/bdd/dto/createAccount.service.dto';
import { UpdateAccountServiceDto } from '@service/bdd/dto/updateAccount.service.dto';
import { DeleteAccountServiceDto } from '@service/bdd/dto/deleteAccount.service.dto';

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

  async getAccounts(dto: GetAccountsServiceDto): Promise<AccountServiceModel[]> {
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