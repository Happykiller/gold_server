// src\service\bdd\bdd.service.sql.ts
import { applyInstanceMixins } from '@happykiller/sunny-apis';
import { BddServiceAccountSQL } from './bdd.service.account.sql';
import { BddServiceOperationSQL } from './bdd.service.operation.sql';
import { BddServiceTestSQL } from './bdd.service.test.mysql';
import { BddServicePasskeyMysql } from './db.service.passkey.mysql';
import { BddServiceUserMysql } from './db.service.user.mysql';



class BddServiceSQL {
  constructor(pool: any) {
    applyInstanceMixins(this, [
      // Project
      BddServiceAccountSQL,
      BddServiceOperationSQL,
      BddServiceTestSQL,
      BddServicePasskeyMysql,
      BddServiceUserMysql
    ], [pool]);
  }
}

export { BddServiceSQL };