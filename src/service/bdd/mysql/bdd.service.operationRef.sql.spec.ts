import { BddServiceOperationSQL } from './bdd.service.operation.sql';

/**
 * Les référentiels d'opération — type, tiers, catégorie — ne rendent que les
 * entrées partagées et celles de l'utilisateur. Ces tests portent sur le
 * **texte de la requête et ses liaisons**, sans base, sur le modèle
 * d'`operationFilters.spec.ts`.
 *
 * Ce qu'ils gardent : **une entrée partagée s'écrit `NULL` dans trois de ces
 * tables et `0` dans `operation_type_list`**, dont la colonne `creator_id` est
 * `NOT NULL` en production comme dans le seed. Ne reconnaître que `NULL` rendait
 * `getOperationTypes` vide pour tout utilisateur — crédit, débit et virement
 * portent `creator_id = 0` — et le champ Type de l'écran de saisie affichait
 * « Aucun résultat ». Le défaut est resté invisible jusqu'au 08/08/2026, les
 * écrans écrivant les trois types en dur dans un `Select`.
 */
const makeService = (rows: unknown[] = []) => {
  const execute = jest.fn().mockResolvedValue([rows]);
  const service = new BddServiceOperationSQL({ execute });
  return { service, execute };
};

const lastQuery = (execute: jest.Mock): string => execute.mock.calls[0][0];
const lastParams = (execute: jest.Mock): unknown[] => execute.mock.calls[0][1];

describe('BddServiceOperationSQL — référentiels', () => {
  describe('getOperationTypes', () => {
    it('reconnaît `0` comme entrée partagée, seule sentinelle possible ici', async () => {
      const { service, execute } = makeService([]);

      await service.getOperationTypes({ user_id: 1 });

      const query = lastQuery(execute);
      expect(query).toContain('FROM operation_type_list');
      expect(query).toContain('a.creator_id = 0');
      expect(query).toContain('a.creator_id IS NULL');
    });

    it('ne lie que le user_id : `0` est un littéral, pas un paramètre', async () => {
      const { service, execute } = makeService([]);

      await service.getOperationTypes({ user_id: 42 });

      // Un `?` de plus décalerait toutes les liaisons suivantes.
      expect(lastParams(execute)).toEqual([42]);
      expect(lastQuery(execute).match(/\?/g)).toHaveLength(1);
    });

    it('rend les trois types que porte la production', async () => {
      const rows = [
        { id: 1, label: 'operation.type-credit', creator_id: 0 },
        { id: 2, label: 'operation.type-debit', creator_id: 0 },
        { id: 3, label: 'operation.type-vire', creator_id: 0 },
      ];
      const { service } = makeService(rows);

      await expect(service.getOperationTypes({ user_id: 1 })).resolves.toEqual(
        rows,
      );
    });
  });

  describe('getOperationThrids', () => {
    it('applique le même prédicat de visibilité', async () => {
      const { service, execute } = makeService([]);

      await service.getOperationThrids({ user_id: 1 });

      const query = lastQuery(execute);
      expect(query).toContain('FROM operation_third_list');
      expect(query).toContain('a.creator_id IS NULL');
      expect(query).toContain('a.creator_id = 0');
      expect(lastParams(execute)).toEqual([1]);
    });
  });

  describe('getOperationCategories', () => {
    it('applique le même prédicat de visibilité', async () => {
      const { service, execute } = makeService([]);

      await service.getOperationCategories({ user_id: 1 });

      const query = lastQuery(execute);
      expect(query).toContain('FROM operation_category_list');
      expect(query).toContain('a.creator_id IS NULL');
      expect(query).toContain('a.creator_id = 0');
      expect(lastParams(execute)).toEqual([1]);
    });
  });

  describe('getOperationStatus', () => {
    it('ne filtre pas par créateur : les deux statuts sont universels', async () => {
      const { service, execute } = makeService([]);

      await service.getOperationStatus();

      expect(lastQuery(execute)).not.toContain('creator_id =');
      expect(lastParams(execute)).toBeUndefined();
    });
  });
});
