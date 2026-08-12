import { BddServiceUserMysql } from './db.service.user.mysql';

/**
 * `getUser` est la requête la plus exposée du serveur : elle est appelée avec
 * le login saisi, depuis `auth`, qui n'a pas de garde d'authentification. Elle
 * interpolait ce login dans le texte SQL (`AND a.code = '${dto.code}'`).
 *
 * Ces tests tiennent les liaisons, sur le modèle de
 * `bdd.service.operationLink.sql.spec.ts`.
 */
const makeService = (rows: unknown[] = []) => {
  const execute = jest.fn().mockResolvedValue([rows]);
  const service = new BddServiceUserMysql();
  // La classe n'a pas de constructeur : en production le pool lui vient des
  // autres classes du mixin `applyInstanceMixins` (bdd.service.sql.ts).
  service.pool = { execute };
  return { service, execute };
};

const lastQuery = (execute: jest.Mock): string => execute.mock.calls[0][0];
const lastParams = (execute: jest.Mock): unknown[] => execute.mock.calls[0][1];

describe('BddServiceUserMysql', () => {
  it('lie le code au lieu de l’interpoler', async () => {
    const { service, execute } = makeService([]);

    await service.getUser({ code: "x' OR 1=1 --" } as never);

    expect(lastQuery(execute)).toContain('a.code = ?');
    expect(lastQuery(execute)).not.toContain('OR 1=1');
    expect(lastParams(execute)).toEqual(["x' OR 1=1 --"]);
  });

  it('lie l’identifiant au lieu de l’interpoler', async () => {
    const { service, execute } = makeService([]);

    await service.getUser({ id: 4 } as never);

    expect(lastQuery(execute)).toContain('a.id = ?');
    expect(lastParams(execute)).toEqual([4]);
  });

  it('préfère le code quand les deux sont fournis', async () => {
    // Ordre historique, conservé : le changer déplacerait silencieusement le
    // critère de résolution de l'utilisateur à la connexion.
    const { service, execute } = makeService([]);

    await service.getUser({ code: 'faro', id: 4 } as never);

    expect(lastQuery(execute)).toContain('a.code = ?');
    expect(lastParams(execute)).toEqual(['faro']);
  });

  it('refuse de chercher sans critère', async () => {
    const { service, execute } = makeService([]);

    await expect(service.getUser({} as never)).rejects.toThrow(
      'BDD_SERVICE_SQL_NO_FILTER',
    );
    expect(execute).not.toHaveBeenCalled();
  });

  it('rend null quand personne ne correspond', async () => {
    const { service } = makeService([]);

    await expect(
      service.getUser({ code: 'inconnu' } as never),
    ).resolves.toBeNull();
  });
});
