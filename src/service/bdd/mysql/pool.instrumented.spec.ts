import { instrumentPool } from '@service/bdd/mysql/pool.instrumented';
import {
  readMetrics,
  runInRequestContext,
} from '@src/common/metrics/request.context';

describe('instrumentPool', () => {
  it('rend la valeur de mysql2 telle quelle, sans la reconstruire', async () => {
    // Le point critique : `execute` rend [rows, fields] en lecture et
    // [ResultSetHeader] en écriture. Reconstruire ce tuple, même à
    // l'identique, casserait tous les appelants d'un coup.
    const rows = [{ id: 1 }];
    const fields = [{ name: 'id' }];
    const retour = [rows, fields];
    const pool = { execute: jest.fn().mockResolvedValue(retour) };

    const resultat = await instrumentPool(pool).execute('SELECT 1', [42]);

    expect(resultat).toBe(retour);
    expect(resultat[0]).toBe(rows);
    expect(pool.execute).toHaveBeenCalledWith('SELECT 1', [42]);
  });

  it('compte les requêtes dans le contexte de la requête HTTP', async () => {
    const pool = {
      execute: jest.fn().mockResolvedValue([[], []]),
      query: jest.fn().mockResolvedValue([[], []]),
    };
    const instrumented = instrumentPool(pool);

    const metrics = await runInRequestContext(async () => {
      await instrumented.execute('SELECT 1');
      await instrumented.execute('SELECT 2');
      await instrumented.query('SELECT 3');
      return readMetrics();
    });

    expect(metrics?.sql).toBe(3);
  });

  it('compte aussi une requête qui échoue, et propage son erreur', async () => {
    // Une requête en erreur a coûté son temps, et c'est souvent la plus lente.
    const pool = {
      execute: jest.fn().mockRejectedValue(new Error('ER_PARSE_ERROR')),
    };
    const instrumented = instrumentPool(pool);

    const metrics = await runInRequestContext(async () => {
      await expect(instrumented.execute('SELECT')).rejects.toThrow(
        'ER_PARSE_ERROR',
      );
      return readMetrics();
    });

    expect(metrics?.sql).toBe(1);
  });

  it('ne casse pas hors contexte de requête', async () => {
    const pool = { execute: jest.fn().mockResolvedValue([[], []]) };

    await expect(
      instrumentPool(pool).execute('SELECT 1'),
    ).resolves.toBeDefined();
    expect(readMetrics()).toBeUndefined();
  });

  it('laisse passer les autres membres du pool', async () => {
    const connection = { release: jest.fn() };
    const pool = {
      execute: jest.fn(),
      getConnection: jest.fn().mockResolvedValue(connection),
      config: { connectionLimit: 20 },
    };
    const instrumented = instrumentPool(pool);

    await expect(instrumented.getConnection()).resolves.toBe(connection);
    expect(instrumented.config.connectionLimit).toBe(20);
  });

  it('signale une requête lente au-delà du seuil', async () => {
    const onSlowQuery = jest.fn();
    const pool = {
      execute: jest
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) => setTimeout(() => resolve([[], []]), 25)),
        ),
    };

    await instrumentPool(pool, { slowQueryMs: 10, onSlowQuery }).execute(
      'SELECT  *\n  FROM operation',
    );

    expect(onSlowQuery).toHaveBeenCalledTimes(1);
    // Le texte est normalisé sur une ligne : un SQL multiligne rendrait le
    // journal illisible.
    expect(onSlowQuery.mock.calls[0][0]).toBe('SELECT * FROM operation');
  });

  it('ne signale rien en deçà du seuil', async () => {
    const onSlowQuery = jest.fn();
    const pool = { execute: jest.fn().mockResolvedValue([[], []]) };

    await instrumentPool(pool, { slowQueryMs: 10_000, onSlowQuery }).execute(
      'SELECT 1',
    );

    expect(onSlowQuery).not.toHaveBeenCalled();
  });

  it('isole les compteurs de deux requêtes HTTP concurrentes', async () => {
    // C'est la raison d'être de l'AsyncLocalStorage : un compteur global
    // serait faux dès que deux requêtes se chevauchent.
    const pool = {
      execute: jest
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) => setTimeout(() => resolve([[], []]), 5)),
        ),
    };
    const instrumented = instrumentPool(pool);

    const [a, b] = await Promise.all([
      runInRequestContext(async () => {
        await instrumented.execute('A1');
        await instrumented.execute('A2');
        return readMetrics()?.sql;
      }),
      runInRequestContext(async () => {
        await instrumented.execute('B1');
        return readMetrics()?.sql;
      }),
    ]);

    expect(a).toBe(2);
    expect(b).toBe(1);
  });
});
