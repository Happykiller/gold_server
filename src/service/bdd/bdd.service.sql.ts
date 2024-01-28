/* istanbul ignore file */
import * as mysql from 'mysql2/promise';

import { config } from '@src/config';
import { ERRORS } from '@src/common/ERROR';
import { BddService } from '@src/service/bdd/bdd.service';
import { UserServiceModel } from '@src/service/bdd/model/user.service.model';
import { GetUserServiceDto } from '@src/service/bdd/dto/getUser.service.dto';
import { AccountServiceModel } from '@service/bdd/model/account.service.model';
import { GetAccountServiceDto } from '@service/bdd/dto/getAccount.service.dto';
import { GetAccountsServiceDto } from '@service/bdd/dto/getAccounts.service.dto';
import { OperationServiceModel } from '@service/bdd/model/operation.service.model';
import { GetOperationServiceDto } from '@service/bdd/dto/getOperation.service.dto';
import { GetOperationsServiceDto } from '@service/bdd/dto/getOperations.service.dto';
import { CreateAccountServiceDto } from '@service/bdd/dto/createAccount.service.dto';
import { UpdateAccountServiceDto } from '@service/bdd/dto/updateAccount.service.dto';
import { DeleteAccountServiceDto } from '@service/bdd/dto/deleteAccount.service.dto';
import { AccountTypeServiceModel } from '@service/bdd/model/accountType.service.model';
import { CreateOperationServiceDto } from '@service/bdd/dto/createOperation.service.dto';
import { UpdateOperationServiceDto } from '@service/bdd/dto/updateOperation.service.dto';
import { DeleteOperationServiceDto } from '@service/bdd/dto/deleteOperation.service.dto';
import { GetOperationLinkServiceDto } from '@service/bdd/dto/getOperationLink.service.dto';
import { OperationLinkServiceModel } from '@service/bdd/model/operationLink.service.model';
import { OperationTypeServiceModel } from '@service/bdd/model/operationType.service.model';
import { OperationThridServiceModel } from '@service/bdd/model/operationThrid.service.model';
import { GetOperationLinksServiceDto } from '@service/bdd/dto/getOperationLinks.service.dto';
import { OperationStatutServiceModel } from '@service/bdd/model/operationStatut.service.model';
import { DeleteOperationLinkServiceDto } from '@service/bdd/dto/deleteOperationLink.service.dto';
import { CreateOperationLinkServiceDto } from '@service/bdd/dto/createOperationLink.service.dto';
import { OperationCategoryServiceModel } from '@service/bdd/model/operationCategory.service.model';

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

  async createOperation(dto: CreateOperationServiceDto): Promise<OperationServiceModel> {
    const query = `INSERT INTO operation (account_id, account_id_dest, amount, date, status_id, type_id, third_id, category_id, description, creator_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ;`;
    const [results] = await this.pool.execute(query, [
      dto.account_id, 
      (dto.account_id_dest)?dto.account_id_dest:null, 
      dto.amount,
      dto.date,
      dto.status_id,
      dto.type_id,
      dto.third_id,
      dto.category_id,
      (dto.description)?dto.description:null, 
      dto.user_id
    ]);
    return await this.getOperation({
      operation_id: results.insertId,
      user_id: dto.user_id
    });
  }

  async getOperation(dto: GetOperationServiceDto): Promise<OperationServiceModel> {
    const query = `SELECT id,
        account_id,
        account_id_dest,
        CASE a.type_id
          WHEN 1 THEN a.amount
          WHEN 2 THEN (a.amount * - 1)
          WHEN 3 THEN (a.amount * - 1)
        END AS amount,
        date,
        status_id,
        type_id,
        third_id,
        category_id,
        description,
        creator_id,
        creation_date,
        modificator_id,
        modification_date
      FROM operation a
      WHERE 1=1
      AND a.active = 1
      AND a.id = ${dto.operation_id}
      AND a.creator_id = ${dto.user_id}
    ;`;
    const [results] = await this.pool.execute(query);
    if(results.length > 0) {
      return results[0];
    } else {
      return null;
    }
  }

  async getOperations(dto: GetOperationsServiceDto): Promise<OperationServiceModel[]> {
    const query = `SELECT 
    h.id,
    h.account_id,
    h.account_id_dest,
    h.move as amount,
    h.date,
    h.status_id,
    h.type_id,
    h.third_id,
    h.category_id,
    h.description,
    h.creator_id,
    h.creation_date,
    h.modificator_id,
    h.modification_date
  FROM (
    SELECT 
      g.id,
      g.amount,
      g.account_id,
      g.account_id_dest,
      g.description,
      g.category_id,
      g.status_id,
      g.third_id,
      g.type_id,
      g.type_id_cal,
      CASE g.type_id_cal
        WHEN 1 THEN g.amount
        WHEN 2 THEN (g.amount * - 1)
      END AS move,
      g.date,
      g.creator_id,
      g.creation_date,
      g.modificator_id,
      g.modification_date
    FROM (
      SELECT 
        a.id,
        a.amount,
        a.account_id,
        a.account_id_dest,
        a.description,
        a.category_id,
        a.status_id,
        a.third_id,
        a.type_id,
        CASE a.type_id
          WHEN 1 THEN 1
          WHEN 2 THEN 2
          WHEN 3 THEN 2
        END AS type_id_cal,
        a.date,
        a.creator_id,
        a.creation_date,
        a.modificator_id,
        a.modification_date
      FROM operation a
      WHERE 1 = 1 
        AND a.account_id = ${dto.account_id}
        AND a.creator_id = ${dto.user_id}
        AND a.active = 1 
      UNION 
      SELECT 
        a.id,
        a.amount,
        a.account_id,
        a.account_id_dest,
        a.description,
        a.category_id,
        a.status_id,
        a.third_id,
        a.type_id,
        1 AS type_id_cal,
        a.date,
        a.creator_id,
        a.creation_date,
        a.modificator_id,
        a.modification_date
      FROM operation a
      WHERE 1 = 1
        AND a.account_id_dest = ${dto.account_id}
        AND a.creator_id = ${dto.user_id}
        AND a.active = 1
    ) g
  ) h
  WHERE 1=1
  ORDER BY h.date DESC, h.id DESC
  LIMIT ${dto.limit} OFFSET ${dto.offset}; 
;`;
    const [results] = await this.pool.execute(query, []);
    return results;
  }

  async updateOperation(dto: UpdateOperationServiceDto): Promise<OperationServiceModel> {
    const old:OperationServiceModel = await this.getOperation(dto);
    const query = `UPDATE operation SET
      account_id = ?,
      account_id_dest = ?,
      amount = ?,
      date = ?,
      status_id = ?,
      type_id = ?,
      third_id = ?,
      category_id = ?,
      description = ?,
      modificator_id = ?,
      modification_date = ?
    WHERE 1=1
      AND id = ?
    ;`;
    const [results] = await this.pool.execute(query, [
      (dto.account_id)?dto.account_id:old.account_id, 
      (dto.account_id_dest)?dto.account_id_dest:old.account_id_dest, 
      (dto.amount)?dto.amount:old.amount, 
      (dto.date)?dto.date:old.date, 
      (dto.status_id)?dto.date:old.status_id, 
      (dto.type_id)?dto.date:old.type_id, 
      (dto.third_id)?dto.date:old.third_id, 
      (dto.category_id)?dto.date:old.category_id, 
      (dto.description)?dto.date:old.description, 
      dto.user_id,
      'now',
      dto.operation_id
    ]);
    return await this.getOperation({
      operation_id: results.updateId,
      user_id: dto.user_id
    });
  }

  async deleteOperation(dto: DeleteOperationServiceDto): Promise<boolean> {
    const query = `UPDATE operation SET
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
      dto.operation_id
    ]);
    return true;
  }

  async getOperationTypes(): Promise<OperationTypeServiceModel[]> {
    const query = `SELECT id,
        label, 
        description, 
        creator_id, 
        creation_date, 
        modificator_id, 
        modification_date
      FROM operation_type_list a
      WHERE 1=1
      AND a.active = 1
    ;`;
    const [results] = await this.pool.execute(query);
    return results;
  }

  async getOperationThrids(): Promise<OperationThridServiceModel[]> {
    const query = `SELECT id,
        label, 
        description, 
        creator_id, 
        creation_date, 
        modificator_id, 
        modification_date
      FROM operation_third_list a
      WHERE 1=1
      AND a.active = 1
    ;`;
    const [results] = await this.pool.execute(query);
    return results;
  }

  async getOperationStatus(): Promise<OperationStatutServiceModel[]> {
    const query = `SELECT id,
        label, 
        description, 
        creator_id, 
        creation_date, 
        modificator_id, 
        modification_date
      FROM operation_status_list a
      WHERE 1=1
      AND a.active = 1
    ;`;
    const [results] = await this.pool.execute(query);
    return results;
  }

  async getOperationCategories(): Promise<OperationCategoryServiceModel[]> {
    const query = `SELECT id,
        label, 
        description, 
        creator_id, 
        creation_date, 
        modificator_id, 
        modification_date
      FROM operation_category_list a
      WHERE 1=1
      AND a.active = 1
    ;`;
    const [results] = await this.pool.execute(query);
    return results;
  }

  async createOperationLink(dto: CreateOperationLinkServiceDto): Promise<OperationLinkServiceModel> {
    const query = `INSERT INTO operation_link (operation_id, operation_ref_id, creator_id)
    VALUES (?, ?, ?)
    ;`;
    const [results] = await this.pool.execute(query, [
      dto.operation_id, 
      dto.operation_ref_id,
      dto.user_id
    ]);
    return await this.getOperationLink({
      operation_link_id: results.insertId,
      user_id: dto.user_id
    });
  }

  async getOperationLink(dto: GetOperationLinkServiceDto): Promise<OperationLinkServiceModel> {
    const query = `SELECT id,
        operation_id,
        operation_ref_id,
        creator_id,
        creation_date,
        modificator_id,
        modification_date
      FROM operation_link a
      WHERE 1=1
      AND a.active = 1
      AND a.id = ?
      AND a.creator_id = ?
    ;`;
    const [results] = await this.pool.execute(query, [
      dto.user_id,
      'now',
      dto.operation_link_id
    ]);
    if(results.length > 0) {
      return results[0];
    } else {
      return null;
    }
  }

  async getOperationLinks(dto: GetOperationLinksServiceDto): Promise<OperationLinkServiceModel[]> {
    const query = `SELECT id,
        operation_id, 
        operation_ref_id, 
        creator_id, 
        creation_date, 
        modificator_id, 
        modification_date
      FROM operation_category_list a
      WHERE 1=1
      AND a.active = 1
      AND a.operation_id = ?
      AND a.creator_id = ?
    ;`;
    const [results] = await this.pool.execute(query, [
      dto.operation_id,
      dto.user_id
    ]);
    return results;
  }

  async deleteOperationLink(dto: DeleteOperationLinkServiceDto): Promise<boolean> {
    const query = `UPDATE operation_link SET
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
      dto.operation_link_id
    ]);
    return true;
  }
}