import { BddServiceOperationFake } from './bdd.service.operation.fake';
import { LINK_DIRECTION } from '@service/bdd/dto/getLinkedOperations.service.dto';

/**
 * Le fake sert les modes `mock` et `test`. Il portait les mêmes défauts que
 * l'adaptateur SQL, en pire : ses identifiants commençaient à -1.
 */
describe('BddServiceOperationFake — liens entre opérations', () => {
  let service: BddServiceOperationFake;

  beforeEach(() => {
    service = new BddServiceOperationFake();
  });

  it('numérote les liens à partir de 1', async () => {
    for (const ref of [10, 11, 12]) {
      await service.createOperationLink({
        user_id: 1,
        operation_id: 5,
        operation_ref_id: ref,
      });
    }

    // `collection.length++ - 1` incrémentait la longueur puis retranchait 1 :
    // le premier lien recevait l'identifiant -1, et le tableau gardait un trou.
    expect(service.collectionOperationLink.map((elt) => elt.id)).toEqual([
      1, 2, 3,
    ]);
  });

  it('retrouve les liens par opération portante, pas par leur propre identifiant', async () => {
    await service.createOperationLink({
      user_id: 1,
      operation_id: 5,
      operation_ref_id: 10,
    });

    const links = await service.getOperationLinks({
      operation_id: 5,
      user_id: 1,
    });

    expect(links).toHaveLength(1);
    expect(links[0].operation_ref_id).toBe(10);
  });

  it('rend false plutôt que de planter sur un identifiant inconnu', async () => {
    // Le fake levait un TypeError là où l'adaptateur SQL se contente de
    // renvoyer false.
    await expect(
      service.deleteOperationLink({ operation_link_id: 999, user_id: 1 }),
    ).resolves.toBe(false);
  });

  it('ne lie que les opérations de l’utilisateur', async () => {
    const mine = await service.createOperation({
      user_id: 1,
      account_id: 1,
      account_id_dest: null,
      amount: 10,
      date: 'now',
      status_id: 1,
      type_id: 2,
      third_id: 1,
      category_id: null,
      description: 'à moi',
    });

    const links = await service.createOperationLinks({
      user_id: 1,
      operation_id: 5,
      // 999 n'existe pas : il ne doit produire aucun lien, comme le
      // `WHERE o.creator_id = ?` de l'adaptateur SQL.
      operation_ref_ids: [mine.id, 999],
    });

    expect(links).toHaveLength(1);
    expect(links[0].operation_ref_id).toBe(mine.id);
  });

  it('remonte des opérations vers le virement qui les couvre', async () => {
    const covered = await service.createOperation({
      user_id: 1,
      account_id: 1,
      account_id_dest: null,
      amount: 10,
      date: 'now',
      status_id: 1,
      type_id: 2,
      third_id: 1,
      category_id: null,
      description: 'dépense',
    });

    await service.createOperationLinks({
      user_id: 1,
      operation_id: 1,
      operation_ref_ids: [covered.id],
    });

    const up = await service.getLinkedOperations({
      user_id: 1,
      operation_id: covered.id,
      direction: LINK_DIRECTION.UP,
    });

    expect(up).toHaveLength(1);
    expect(up[0].id).toBe(1);
    expect(up[0].link_id).toBe(1);
  });
});
