import { BddServiceOperationSQL } from './bdd.service.operation.sql';

/**
 * `updateOperation` porte le pointage (`setReco`), le geste le plus répété du
 * produit. Sa clause `SET` est désormais construite dynamiquement : ces tests
 * verrouillent les deux choses qui pourraient s'y perdre en silence — le
 * `null` explicite, et le cloisonnement par `creator_id`.
 */
const makeService = () => {
  const execute = jest.fn().mockResolvedValue([[{ id: 7 }]]);
  const service = new BddServiceOperationSQL({ execute });
  return { service, execute };
};

/** Le premier appel est l'UPDATE ; le second est la relecture de retour. */
const updateQuery = (execute: jest.Mock): string => execute.mock.calls[0][0];
const updateParams = (execute: jest.Mock): unknown[] =>
  execute.mock.calls[0][1];

describe('BddServiceOperationSQL — updateOperation', () => {
  it('n’écrit que les colonnes fournies', async () => {
    // Le pointage n'envoie que status_id et date : les huit autres colonnes
    // n'ont aucune raison d'être réécrites, ni relues pour l'être.
    const { service, execute } = makeService();

    await service.updateOperation({
      operation_id: 7,
      user_id: 1,
      status_id: 2,
      date: '2026-08-10',
    });

    const query = updateQuery(execute);
    expect(query).toMatch(/status_id = \?/);
    expect(query).toMatch(/date = \?/);
    expect(query).not.toMatch(/amount = \?/);
    expect(query).not.toMatch(/description = \?/);
    // L'ordre des liaisons suit celui des colonnes du SET — donc `date` avant
    // `status_id` — et non l'ordre des clés du DTO.
    expect(updateParams(execute)).toEqual(['2026-08-10', 2, 1, 7, 1]);
  });

  it('ne relit plus l’opération avant d’écrire', async () => {
    // Le usecase l'a déjà lue pour sa garde OPERATION_NOT_FOUND : c'était un
    // aller-retour pour rien. Reste l'UPDATE, puis la relecture de retour.
    const { service, execute } = makeService();

    await service.updateOperation({ operation_id: 7, user_id: 1, amount: 10 });

    expect(execute).toHaveBeenCalledTimes(2);
    expect(updateQuery(execute)).toMatch(/^UPDATE operation SET/);
  });

  it('vide bien une colonne sur un null explicite', async () => {
    // La distinction `undefined` (absent) / `null` (à effacer) est la raison
    // pour laquelle le filtre teste `!== undefined` et non la véracité.
    const { service, execute } = makeService();

    await service.updateOperation({
      operation_id: 7,
      user_id: 1,
      description: null,
      category_id: null,
    });

    expect(updateQuery(execute)).toMatch(/description = \?/);
    expect(updateParams(execute)).toEqual([null, null, 1, 7, 1]);
  });

  it('cloisonne l’écriture par creator_id', async () => {
    // L'UPDATE ne filtrait que sur `id` : le cloisonnement ne tenait qu'à la
    // relecture supprimée. Sans ce WHERE, un operation_id deviné suffirait.
    const { service, execute } = makeService();

    await service.updateOperation({ operation_id: 7, user_id: 1, amount: 10 });

    const query = updateQuery(execute);
    expect(query).toMatch(/AND creator_id = \?/);
    expect(query).toMatch(/AND active = 1/);
    // …et l'id de l'utilisateur est bien lié en dernier, après l'operation_id.
    expect(updateParams(execute).slice(-2)).toEqual([7, 1]);
  });

  it('met quand même à jour le modificateur quand rien d’autre ne change', async () => {
    const { service, execute } = makeService();

    await service.updateOperation({ operation_id: 7, user_id: 1 });

    const query = updateQuery(execute);
    expect(query).toMatch(/SET\s+modificator_id = \?/);
    // Pas de virgule orpheline avant `modificator_id`, qui rendrait le SQL
    // invalide dès qu'aucune colonne métier n'est fournie.
    expect(query).not.toMatch(/SET\s*,/);
    expect(updateParams(execute)).toEqual([1, 7, 1]);
  });
});
