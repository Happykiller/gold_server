import { BddServiceOperationSQL } from './bdd.service.operation.sql';
import { GetOperationsServiceDto } from '@service/bdd/dto/getOperations.service.dto';

/**
 * `buildOperationFilters` est privé : on y accède par indexation plutôt que de
 * l'exposer pour les besoins du test. Ce qu'on vérifie ici n'est pas le SQL
 * produit — c'est qu'il reste **cohérent avec ses paramètres**.
 */
const build = (dto: Partial<GetOperationsServiceDto>) => {
  const service = Object.create(
    BddServiceOperationSQL.prototype,
  ) as BddServiceOperationSQL;
  return (
    service as unknown as {
      buildOperationFilters: (d: GetOperationsServiceDto) => {
        clause: string;
        params: unknown[];
      };
    }
  ).buildOperationFilters({
    user_id: 1,
    account_id: 2,
    limit: 50,
    offset: 0,
    ...dto,
  });
};

const countPlaceholders = (clause: string) =>
  (clause.match(/\?/g) ?? []).length;

describe('buildOperationFilters', () => {
  it('ne produit aucune clause sans critère', () => {
    const { clause, params } = build({});
    expect(clause).toBe('');
    expect(params).toEqual([]);
  });

  it.each([
    ['catégories', { category_ids: [1, 2, 3] }],
    ['tiers', { third_ids: [4] }],
    ['enveloppes', { dest_account_ids: [5, 6] }],
    ['types', { type_ids: [1] }],
    ['statuts', { status_ids: [1, 2] }],
    ['montant', { amount_min: 10, amount_max: 50 }],
    ['dates', { date_from: '2026-01-01', date_to: '2026-06-30' }],
    ['description', { description: 'fai' }],
    ['texte large', { text: 'alimentation' }],
    [
      'tout combiné',
      {
        category_ids: [1, 2],
        third_ids: [3],
        dest_account_ids: [4],
        type_ids: [2],
        status_ids: [1],
        amount_min: 10,
        amount_max: 50,
        date_from: '2026-01-01',
        date_to: '2026-06-30',
        description: 'fai',
        text: 'ali',
      },
    ],
  ])(
    'accorde le nombre de ? au nombre de paramètres — %s',
    (_label, dto: Partial<GetOperationsServiceDto>) => {
      const { clause, params } = build(dto);
      // Un décalage ici ne casse pas la compilation : il casse la requête à
      // l'exécution, ou pire, décale silencieusement les valeurs.
      expect(countPlaceholders(clause)).toBe(params.length);
      expect(params.length).toBeGreaterThan(0);
    },
  );

  it('ignore les listes vides plutôt que de produire un IN ()', () => {
    const { clause, params } = build({ category_ids: [], third_ids: [] });
    expect(clause).toBe('');
    expect(params).toEqual([]);
  });

  it('n’interpole jamais la saisie utilisateur dans le SQL', () => {
    const { clause, params } = build({
      description: "' OR 1=1 --",
      text: "'; DROP TABLE operation; --",
    });
    expect(clause).not.toContain('OR 1=1');
    expect(clause).not.toContain('DROP TABLE');
    expect(clause).toContain('LIKE ?');
    expect(params).toContain("%' OR 1=1 --%");
  });

  it('échappe les jokers LIKE de la saisie', () => {
    // Sans échappement, « 100% » ou « credit_agricole » élargiraient la
    // recherche au lieu de la restreindre.
    const { params } = build({ description: '100%_x' });
    expect(params[0]).toBe('%100\\%\\_x%');
  });

  it('produit un ? par identifiant d’une liste', () => {
    const { clause, params } = build({ category_ids: [7, 8, 9] });
    expect(clause).toContain('IN (?, ?, ?)');
    expect(params).toEqual([7, 8, 9]);
  });

  it('cherche le texte large dans la description, le tiers et la catégorie', () => {
    const { clause, params } = build({ text: 'ali' });
    expect(clause).toContain('operation_third_list');
    expect(clause).toContain('operation_category_list');
    expect(params).toEqual(['%ali%', '%ali%', '%ali%']);
  });
});
