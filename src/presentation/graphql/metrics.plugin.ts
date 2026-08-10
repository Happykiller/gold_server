// src\presentation\graphql\metrics.plugin.ts
/**
 * Journalise, pour chaque opération GraphQL, sa durée et le nombre de requêtes
 * SQL qu'elle a déclenchées.
 *
 * Un plugin Apollo et non un interceptor NestJS : un interceptor global se
 * déclenche à chaque **champ** résolu, soit des dizaines de fois par requête
 * dans un schéma qui a des resolvers de champs — c'est-à-dire exactement le
 * cas d'usage qu'on cherche à mesurer. `requestDidStart` / `willSendResponse`
 * donnent une ligne par opération, avec son nom.
 *
 * La ligne produite est la contrepartie durable de l'audit du 10/08/2026 : le
 * nombre de requêtes SQL est la grandeur structurelle du N+1, celle qui ne
 * dépend ni de la machine ni du cache. Une durée s'améliore parce que le poste
 * est moins chargé ; 169 requêtes qui deviennent 6, non.
 */
import type {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from '@apollo/server';

import { readMetrics } from '@src/common/metrics/request.context';

export interface MetricsPluginOptions {
  /** Journalise seulement au-delà de ce seuil. 0 = tout. */
  slowOperationMs?: number;
  log: (message: string, meta: Record<string, unknown>) => void;
}

export const createMetricsPlugin = (
  options: MetricsPluginOptions,
): ApolloServerPlugin => ({
  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    const startedAt = process.hrtime.bigint();

    return {
      async willSendResponse(context) {
        const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
        if (durationMs < (options.slowOperationMs ?? 0)) return;

        const metrics = readMetrics();
        // `sqlMs` est une SOMME de durées, pas une part de `ms` : les requêtes
        // partent en parallèle sur les connexions du pool. Un `sqlMs` très
        // supérieur à `ms` n'est donc pas une incohérence — c'est la signature
        // d'un N+1 dont le parallélisme masque le coût réel (168 requêtes,
        // 13,9 s cumulées, 264 ms de mur, mesuré le 10/08/2026).
        options.log('graphql', {
          operation: context.operationName ?? 'anonymous',
          ms: Math.round(durationMs),
          sql: metrics?.sql ?? 0,
          sqlMs: metrics ? Math.round(metrics.sqlMs) : 0,
          errors: context.errors?.length ?? 0,
        });
      },
    };
  },
});
