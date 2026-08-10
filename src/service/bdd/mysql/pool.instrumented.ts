// src\service\bdd\mysql\pool.instrumented.ts
/**
 * Enveloppe un pool mysql2 pour compter et chronométrer ses requêtes.
 *
 * Posé ici, au seul endroit où le pool est fabriqué, plutôt que dans chaque
 * `bdd.service.*.sql.ts` : les services reçoivent le pool par constructeur et
 * ne voient pas la différence — aucun fichier SQL n'est modifié, et un service
 * ajouté demain est instrumenté sans qu'on y pense.
 *
 * Un Proxy plutôt qu'une classe qui redéclare `execute`/`query` : le pool
 * expose bien d'autres méthodes (`getConnection`, `end`, `on`…) et le jour où
 * l'une d'elles sera utilisée, l'enveloppe ne doit pas être ce qui casse.
 *
 * Contrat impératif : la valeur de retour de mysql2 est rendue **telle
 * quelle**. `execute` renvoie `[rows, fields]` en lecture et `[ResultSetHeader]`
 * en écriture ; la reconstruire, même à l'identique, casserait tout le code
 * appelant d'un coup.
 */
import { countSql } from '@src/common/metrics/request.context';

/** Au-delà, la requête est journalisée comme lente. */
const DEFAULT_SLOW_MS = 100;

export interface InstrumentPoolOptions {
  slowQueryMs?: number;
  onSlowQuery?: (sql: string, durationMs: number) => void;
}

const measure = async (
  call: () => Promise<unknown>,
  sql: unknown,
  options: InstrumentPoolOptions,
): Promise<unknown> => {
  const startedAt = process.hrtime.bigint();
  try {
    return await call();
  } finally {
    // Dans le `finally` : une requête qui échoue a coûté son temps elle aussi,
    // et c'est souvent la plus lente. La compter seulement en cas de succès
    // rendrait le compteur optimiste au pire moment.
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    countSql(durationMs);
    const seuil = options.slowQueryMs ?? DEFAULT_SLOW_MS;
    if (durationMs >= seuil && options.onSlowQuery) {
      options.onSlowQuery(
        typeof sql === 'string' ? sql.replace(/\s+/g, ' ').trim() : '?',
        durationMs,
      );
    }
  }
};

export const instrumentPool = (
  pool: any,
  options: InstrumentPoolOptions = {},
): any =>
  new Proxy(pool, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (
        (prop !== 'execute' && prop !== 'query') ||
        typeof value !== 'function'
      ) {
        return value;
      }
      return (...args: unknown[]) =>
        measure(() => value.apply(target, args), args[0], options);
    },
  });
