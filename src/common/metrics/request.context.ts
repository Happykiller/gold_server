// src\common\metrics\request.context.ts
/**
 * Compteurs attachés à une requête HTTP, sans les faire traverser le code.
 *
 * Le besoin : savoir combien de requêtes SQL part une opération GraphQL.
 * L'audit du 10/08/2026 a montré qu'un lot de 50 opérations en déclenchait
 * 169 là où 3 suffisent — mais ce chiffre s'obtenait à la main, en lisant le
 * compteur global de MariaDB avant et après. Un compteur global est faux dès
 * que deux requêtes se chevauchent, et invisible en production.
 *
 * Pourquoi un AsyncLocalStorage plutôt qu'un paramètre : la couche SQL n'a
 * aucun accès au contexte GraphQL, et lui en donner un imposerait de changer
 * la signature de chaque méthode de `bdd.service.*.sql.ts`. Le store suit la
 * chaîne des `await` sans être nommé nulle part, ce qui laisse la couche
 * service exactement telle qu'elle est.
 */
import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestMetrics {
  sql: number;
  sqlMs: number;
}

const storage = new AsyncLocalStorage<RequestMetrics>();

/** Ouvre un contexte de mesure pour la durée d'une requête HTTP. */
export const runInRequestContext = <T>(fn: () => T): T =>
  storage.run({ sql: 0, sqlMs: 0 }, fn);

/**
 * Enregistre une requête SQL et sa durée. Hors contexte — au démarrage, dans
 * une tâche planifiée, dans un test — l'appel ne fait rien : l'instrumentation
 * ne doit jamais être une raison de plantage.
 */
export const countSql = (durationMs: number): void => {
  const metrics = storage.getStore();
  if (!metrics) return;
  metrics.sql += 1;
  metrics.sqlMs += durationMs;
};

/** Lit les compteurs de la requête courante, ou `undefined` hors contexte. */
export const readMetrics = (): RequestMetrics | undefined => storage.getStore();
