import { cacheOf, RequestCache } from '@src/common/graphql/request.cache';

describe('RequestCache', () => {
  it('ne charge qu’une fois pour N appels concurrents de la même clé', async () => {
    // Le cas réel : les resolvers des 50 lignes d'une page partent dans le
    // même tick. Mémoriser le résultat au lieu de la promesse les laisserait
    // tous démarrer leur propre chargement avant que le premier ne réponde.
    const load = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve('ok'), 10)),
      );
    const cache = new RequestCache();

    const results = await Promise.all(
      Array.from({ length: 50 }, () => cache.get('k', load)),
    );

    expect(load).toHaveBeenCalledTimes(1);
    expect(results.every((r) => r === 'ok')).toBe(true);
  });

  it('sépare deux clés', async () => {
    const load = jest.fn().mockResolvedValue('ok');
    const cache = new RequestCache();

    await cache.get('a', load);
    await cache.get('b', load);

    expect(load).toHaveBeenCalledTimes(2);
  });

  it('cloisonne deux utilisateurs par la clé', async () => {
    // Le contexte est déjà propre à une requête, donc à un utilisateur. La clé
    // rend la fuite structurellement impossible plutôt qu'improbable (loi 1).
    const cache = new RequestCache();
    const load1 = jest.fn().mockResolvedValue('données de 1');
    const load2 = jest.fn().mockResolvedValue('données de 2');

    const a = await cache.get('accounts:1', load1);
    const b = await cache.get('accounts:2', load2);

    expect(a).toBe('données de 1');
    expect(b).toBe('données de 2');
  });

  it('ne garde pas un échec en cache', async () => {
    const load = jest
      .fn()
      .mockRejectedValueOnce(new Error('bdd indisponible'))
      .mockResolvedValueOnce('ok');
    const cache = new RequestCache();

    await expect(cache.get('k', load)).rejects.toThrow('bdd indisponible');
    // La requête suivante doit pouvoir retenter, pas rejouer l'échec.
    await expect(cache.get('k', load)).resolves.toBe('ok');
  });

  it('deux requêtes HTTP ne partagent rien', async () => {
    const load = jest.fn().mockResolvedValue('ok');

    await new RequestCache().get('k', load);
    await new RequestCache().get('k', load);

    expect(load).toHaveBeenCalledTimes(2);
  });
});

describe('cacheOf', () => {
  it('rend le cache du contexte quand il y en a un', async () => {
    const cache = new RequestCache();
    expect(cacheOf({ cache })).toBe(cache);
  });

  it('rend un cache jetable hors contexte, plutôt que de planter', async () => {
    // Un resolver appelé depuis un test ou un script n'a pas de contexte
    // GraphQL : il doit fonctionner, sans mémoire partagée.
    const load = jest.fn().mockResolvedValue('ok');

    await expect(cacheOf(undefined).get('k', load)).resolves.toBe('ok');
    await expect(cacheOf({}).get('k', load)).resolves.toBe('ok');
    expect(load).toHaveBeenCalledTimes(2);
  });
});
