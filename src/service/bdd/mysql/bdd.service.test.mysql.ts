// src\service\bdd\bdd.service.test.sql.ts
export class BddServiceTestSQL {

  pool: any;

  constructor(pool: any) {
    this.pool = pool;
  }

  async test(): Promise<boolean> {
    const query = `SELECT 1;`;
    await this.pool.execute(query);
    return Promise.resolve(true);
  }
}