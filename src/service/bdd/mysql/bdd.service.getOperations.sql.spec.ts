import { BddServiceOperationSQL } from './bdd.service.operation.sql';

/**
 * La requête de liste est le chemin le plus chaud du produit, et le plus
 * piégeux du dépôt : la clause de filtre y est insérée **deux fois** et ses
 * paramètres fournis deux fois. Tout ce qui touche à son texte doit donc
 * prouver, en plus de son intention, que l'alignement des `?` n'a pas bougé.
 *
 * Tests sur le texte et les liaisons, sans base — modèle
 * d'`operationFilters.spec.ts`, et non le fake, dont le `getOperations` ignore
 * `limit`/`offset` et compare l'id de l'opération à celui du compte.
 */
const makeService = (rows: unknown[] = []) => {
  const execute = jest.fn().mockResolvedValue([rows]);
  const service = new BddServiceOperationSQL({ execute });
  return { service, execute };
};

const lastQuery = (execute: jest.Mock): string => execute.mock.calls[0][0];
const lastParams = (execute: jest.Mock): unknown[] => execute.mock.calls[0][1];

/** Le corps de la seconde branche du UNION, celle des virements reçus. */
const secondBranch = (query: string): string =>
  query.slice(query.indexOf('UNION ALL'));

describe('BddServiceOperationSQL — getOperations', () => {
  const dto = { account_id: 2, user_id: 1, limit: 50, offset: 0 };

  it('ne dédoublonne plus : UNION ALL, et aucun UNION nu', async () => {
    // Le UNION obligeait MariaDB à matérialiser et dédoublonner l'historique
    // entier des deux branches avant le LIMIT : 71 ms contre 13 ms.
    const { service, execute } = makeService();

    await service.getOperations(dto);

    const query = lastQuery(execute);
    expect(query).toMatch(/UNION\s+ALL/);
    expect(query).not.toMatch(/UNION(?!\s+ALL)/);
  });

  it('exclut de la seconde branche les opérations d’un compte vers lui-même', async () => {
    // C'est la SEULE classe de doublons que le UNION écartait. Sans ce
    // prédicat, un virement d'un compte vers lui-même s'afficherait deux fois.
    const { service, execute } = makeService();

    await service.getOperations(dto);

    expect(secondBranch(lastQuery(execute))).toMatch(
      /a\.account_id\s+IS NULL\s+OR\s+a\.account_id\s+<>\s+a\.account_id_dest/,
    );
  });

  it('ne pose pas ce prédicat sur la première branche', async () => {
    // L'y ajouter retirerait de vraies lignes : une opération émise depuis le
    // compte consulté doit s'afficher même si elle se vire à elle-même.
    const { service, execute } = makeService();

    await service.getOperations(dto);

    const query = lastQuery(execute);
    const first = query.slice(0, query.indexOf('UNION ALL'));
    expect(first).not.toMatch(/account_id\s+<>\s+a\.account_id_dest/);
  });

  it('remonte `active` depuis la table jusqu’à la projection finale', async () => {
    // Le champ est `Boolean!` au schéma. Comme la colonne n'était sélectionnée
    // à aucun niveau, toute requête qui demandait `active` échouait en
    // INTERNAL_SERVER_ERROR — invisible tant que le front ne le demande pas.
    const { service, execute } = makeService();

    await service.getOperations(dto);

    const query = lastQuery(execute);
    expect(query).toMatch(/a\.active,/);
    expect(query).toMatch(/g\.active,/);
    expect(query).toMatch(/h\.active,/);
  });

  it('lie les paramètres dans l’ordre, filtres compris deux fois', async () => {
    const { service, execute } = makeService();

    await service.getOperations({
      ...dto,
      offset: 150,
      category_ids: [3, 4],
      amount_min: 10,
    });

    // branche 1 (compte, créateur, filtres), branche 2 à l'identique, puis la
    // pagination. Le prédicat anti-doublon n'introduit aucun `?` : c'est ce qui
    // garantit que cet alignement n'a pas bougé.
    expect(lastParams(execute)).toEqual([
      2, 1, 3, 4, 10, 2, 1, 3, 4, 10, 50, 150,
    ]);
  });

  it('lie les paramètres sans aucun filtre', async () => {
    const { service, execute } = makeService();

    await service.getOperations(dto);

    expect(lastParams(execute)).toEqual([2, 1, 2, 1, 50, 0]);
  });

  it('compte les liens après le LIMIT, pas avant', async () => {
    // Les sous-requêtes de comptage vivent dans l'enveloppe `p`, posée après
    // la pagination : sinon elles s'évalueraient sur les 10 339 lignes triées
    // pour n'en garder que 50.
    const { service, execute } = makeService();

    await service.getOperations(dto);

    const query = lastQuery(execute);
    // L'enveloppe englobe la sous-requête paginée : dans le TEXTE elle vient
    // donc avant le LIMIT. Ce qui se vérifie, c'est qu'elle est corrélée à
    // l'alias `p` — la page — et que `) p` referme bien le bloc du LIMIT.
    expect(query).toMatch(/l\.operation_id = p\.id/);
    expect(query.indexOf('LIMIT ? OFFSET ?')).toBeLessThan(
      query.indexOf(') p'),
    );
  });
});
