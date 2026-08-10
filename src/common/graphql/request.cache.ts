// src\common\graphql\request.cache.ts
/**
 * Mémo valable le temps d'UNE requête GraphQL.
 *
 * Le besoin : les resolvers de champs s'exécutent une fois par ligne. Sur un
 * lot de 50 opérations, cela faisait 50 lectures du même compte et 50
 * rechargements du même référentiel — 169 requêtes SQL pour une page.
 *
 * Pourquoi pas un DataLoader : DataLoader résout le regroupement *par clé* (N
 * `load(id)` en un `loadMany`). Ici aucun chargement n'a de clé — les
 * référentiels ne prennent que le `user_id`, et le besoin est « charge la
 * collection entière, une fois ». Une `Map` de promesses suffit, sans ajouter
 * de dépendance ni de fabrique de clés.
 *
 * Pourquoi dans le contexte GraphQL et surtout PAS dans le conteneur
 * d'injection : ce dernier est un singleton, son cache serait partagé entre
 * utilisateurs. Le contexte, lui, naît et meurt avec la requête HTTP. Un solde
 * mémorisé au-delà afficherait de toute façon un montant périmé dès le
 * pointage suivant.
 *
 * La PROMESSE est mémorisée, pas le résultat : les resolvers de 50 lignes
 * partent dans le même tick, et mémoriser le résultat les laisserait tous
 * démarrer leur propre chargement avant que le premier n'ait répondu.
 */
export class RequestCache {
  private readonly entries = new Map<string, Promise<unknown>>();

  get<T>(key: string, load: () => Promise<T>): Promise<T> {
    const known = this.entries.get(key);
    if (known) return known as Promise<T>;

    // Une erreur ne doit pas rester en cache : la requête suivante du même
    // contexte doit pouvoir retenter plutôt que de rejouer l'échec.
    const pending = load().catch((error) => {
      this.entries.delete(key);
      throw error;
    });
    this.entries.set(key, pending);
    return pending;
  }
}

/**
 * Le cache d'une requête, ou un cache jetable si le contexte n'en porte pas —
 * un resolver appelé hors requête HTTP (test, script) doit fonctionner, pas
 * planter.
 */
export const cacheOf = (context: { cache?: RequestCache } | undefined) => {
  if (context?.cache) return context.cache;
  return new RequestCache();
};
