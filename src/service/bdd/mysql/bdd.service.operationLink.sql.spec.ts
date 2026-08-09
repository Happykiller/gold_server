import { BddServiceOperationSQL } from './bdd.service.operation.sql';
import { LINK_DIRECTION } from '@service/bdd/dto/getLinkedOperations.service.dto';

/**
 * Les liens entre opérations sont restés cassés pendant deux ans sans que rien
 * ne le signale : le code existait, était câblé, et personne ne l'appelait.
 *
 * Ces tests portent sur le **texte de la requête et ses liaisons**, sans base,
 * sur le modèle d'`operationFilters.spec.ts`. C'est exactement le levier qui
 * aurait attrapé les quatre défauts corrigés ici.
 */
const makeService = (rows: unknown[] = [], meta: unknown = {}) => {
  const execute = jest.fn().mockResolvedValue([
    // mysql2 rend `[rows, fields]` pour un SELECT et `[resultSetHeader]` pour
    // une écriture : le même tableau sert aux deux, avec les métadonnées
    // (affectedRows, insertId) posées sur l'objet de premier rang.
    Object.assign(rows, meta),
  ]);
  const service = new BddServiceOperationSQL({ execute });
  return { service, execute };
};

const lastQuery = (execute: jest.Mock): string => execute.mock.calls[0][0];
const lastParams = (execute: jest.Mock): unknown[] => execute.mock.calls[0][1];

describe('BddServiceOperationSQL — liens entre opérations', () => {
  describe('getOperationLink', () => {
    it('lie les paramètres dans l’ordre des ? du texte, pas dans celui du DTO', async () => {
      const { service, execute } = makeService([{ id: 7 }]);

      await service.getOperationLink({ operation_link_id: 7, user_id: 1 });

      // Inversées, ces deux liaisons cherchaient le lien n° <user_id>
      // appartenant à l'utilisateur n° <operation_link_id> : la lecture ne
      // rendait jamais rien, et createOperationLink renvoyait donc null après
      // avoir pourtant inséré sa ligne.
      expect(lastParams(execute)).toEqual([7, 1]);
    });

    it('sélectionne `active`, que le modèle GraphQL déclare non nullable', async () => {
      const { service, execute } = makeService([]);

      await service.getOperationLink({ operation_link_id: 7, user_id: 1 });

      expect(lastQuery(execute)).toMatch(/\bactive,/);
    });
  });

  describe('getOperationLinks', () => {
    it('interroge operation_link et non le référentiel des catégories', async () => {
      const { service, execute } = makeService([]);

      await service.getOperationLinks({ operation_id: 42, user_id: 1 });

      const query = lastQuery(execute);
      expect(query).toContain('FROM operation_link');
      // Copié de getOperationCategories, il lisait operation_category_list —
      // une table sans colonne operation_id : « Unknown column » à chaque appel.
      expect(query).not.toContain('operation_category_list');
    });

    it('cloisonne par créateur', async () => {
      const { service, execute } = makeService([]);

      await service.getOperationLinks({ operation_id: 42, user_id: 1 });

      expect(lastQuery(execute)).toContain('a.creator_id = ?');
      expect(lastParams(execute)).toEqual([42, 1]);
    });
  });

  describe('deleteOperationLink', () => {
    it('n’accepte de supprimer que les liens de l’utilisateur', async () => {
      const { service, execute } = makeService([], { affectedRows: 1 });

      await service.deleteOperationLink({ operation_link_id: 7, user_id: 1 });

      // Sans ce filtre, l'identifiant du lien suffisait à défaire celui d'un
      // autre utilisateur.
      expect(lastQuery(execute)).toContain('AND creator_id = ?');
      expect(lastParams(execute)).toEqual([1, 7, 1]);
    });

    it('rend false quand aucune ligne n’a été touchée', async () => {
      const { service } = makeService([], { affectedRows: 0 });

      const result = await service.deleteOperationLink({
        operation_link_id: 999,
        user_id: 1,
      });

      // `true` inconditionnel masquait aussi bien un identifiant inconnu qu'un
      // lien appartenant à quelqu'un d'autre.
      expect(result).toBe(false);
    });
  });

  describe('createOperationLinks', () => {
    it('n’écrit rien quand la liste est vide', async () => {
      const { service, execute } = makeService([]);

      const result = await service.createOperationLinks({
        user_id: 1,
        operation_id: 10,
        operation_ref_ids: [],
      });

      expect(execute).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('dédoublonne les identifiants et exclut l’opération portante', async () => {
      const { service, execute } = makeService([]);

      await service.createOperationLinks({
        user_id: 1,
        operation_id: 10,
        operation_ref_ids: [7, 7, 8, 10],
      });

      // 7 une seule fois, 8, et surtout pas 10 : une opération ne se prend pas
      // elle-même en charge.
      expect(lastParams(execute)).toEqual([10, 1, 7, 8, 1, 10]);
    });

    it('fournit autant de paramètres que la requête compte de ?', async () => {
      const { service, execute } = makeService([]);

      await service.createOperationLinks({
        user_id: 1,
        operation_id: 10,
        operation_ref_ids: [7, 8, 9],
      });

      const placeholders = (lastQuery(execute).match(/\?/g) ?? []).length;
      expect(lastParams(execute)).toHaveLength(placeholders);
    });

    it('filtre les opérations d’autrui dans la clause de sélection elle-même', async () => {
      const { service, execute } = makeService([]);

      await service.createOperationLinks({
        user_id: 1,
        operation_id: 10,
        operation_ref_ids: [7],
      });

      const query = lastQuery(execute);
      // Le cloisonnement n'est pas vérifié en amont puis appliqué : il EST la
      // clause de sélection de l'INSERT … SELECT. Il n'y a rien à contourner.
      expect(query).toContain('INSERT INTO operation_link');
      expect(query).toContain('o.creator_id = ?');
      expect(query).toContain('o.active = 1');
      expect(query).toContain('NOT EXISTS');
    });
  });

  describe('getLinkedOperations', () => {
    it('descend du virement vers les opérations qu’il prend en charge', async () => {
      const { service, execute } = makeService([]);

      await service.getLinkedOperations({
        user_id: 1,
        operation_id: 10,
        direction: LINK_DIRECTION.DOWN,
      });

      const query = lastQuery(execute);
      expect(query).toContain('JOIN operation o ON o.id = l.operation_ref_id');
      expect(query).toContain('AND l.operation_id = ?');
    });

    it('remonte de l’opération vers les virements qui la couvrent', async () => {
      const { service, execute } = makeService([]);

      await service.getLinkedOperations({
        user_id: 1,
        operation_id: 10,
        direction: LINK_DIRECTION.UP,
      });

      const query = lastQuery(execute);
      expect(query).toContain('JOIN operation o ON o.id = l.operation_id');
      expect(query).toContain('AND l.operation_ref_id = ?');
    });

    it.each([LINK_DIRECTION.DOWN, LINK_DIRECTION.UP])(
      'écarte les opérations supprimées, dans le sens %s',
      async (direction) => {
        const { service, execute } = makeService([]);

        await service.getLinkedOperations({
          user_id: 1,
          operation_id: 10,
          direction,
        });

        // Des liens actifs pointent vers des opérations supprimées : sans ce
        // filtre, le détail listerait des lignes que la liste ne montre plus,
        // et le compteur ne collerait pas avec la liste affichée.
        expect(lastQuery(execute)).toContain('AND o.active = 1');
      },
    );
  });

  describe('les compteurs de liens', () => {
    it.each([
      [
        'getOperation',
        (s: BddServiceOperationSQL) =>
          s.getOperation({ operation_id: 1, user_id: 1 }),
      ],
      [
        'getOperations',
        (s: BddServiceOperationSQL) =>
          s.getOperations({ account_id: 2, user_id: 1, limit: 50, offset: 0 }),
      ],
    ])('sont fournis par %s', async (_name, call) => {
      const { service, execute } = makeService([]);

      await call(service);

      const query = lastQuery(execute);
      // Les deux champs sont non nullables : une requête qui les oublie ne
      // casse que l'écran qu'elle sert, et seulement lui.
      expect(query).toContain('AS linked_count');
      expect(query).toContain('AS linked_by_count');
    });

    it('n’ajoute aucun paramètre à getOperations', async () => {
      const { service, execute } = makeService([]);

      await service.getOperations({
        account_id: 2,
        user_id: 1,
        limit: 50,
        offset: 0,
      });

      // Les sous-requêtes se corrèlent sur p.creator_id, sans `?`. Un
      // paramètre glissé dans une liste SELECT viendrait textuellement AVANT
      // ceux du FROM et décalerait toutes les liaisons suivantes — c'est
      // exactement le mécanisme du bug de getOperationLink.
      expect(lastParams(execute)).toEqual([2, 1, 2, 1, 50, 0]);
    });
  });
});
