import { CreateOperationUsecase } from '@usecase/createOperation.usecase';
import { CreateOperationUsecaseDto } from '@usecase/dto/createOperation.usecase.dto';

/**
 * Un virement prend en charge des opérations, et ces liens naissent avec lui.
 *
 * Ce qui est vérifié ici, c'est l'orchestration des deux écritures : le service
 * `createOperation` ne doit rien savoir des liens, et un virement dont les
 * liens échouent ne doit pas subsister à moitié lié.
 */
describe('CreateOperationUsecase', () => {
  const base: CreateOperationUsecaseDto = {
    user_id: 1,
    account_id: 2,
    account_id_dest: 3,
    amount: 42,
    date: '2026-08-09',
    status_id: 2,
    type_id: 3,
    third_id: 1,
    category_id: 1,
    description: 'virement',
  };

  const created = { id: 100 };

  let bddService: {
    createOperation: jest.Mock;
    createOperationLinks: jest.Mock;
    deleteOperation: jest.Mock;
    getOperation: jest.Mock;
  };
  let usecase: CreateOperationUsecase;

  beforeEach(() => {
    bddService = {
      createOperation: jest.fn().mockResolvedValue(created),
      createOperationLinks: jest.fn().mockResolvedValue([]),
      deleteOperation: jest.fn().mockResolvedValue(true),
      getOperation: jest
        .fn()
        .mockResolvedValue({ ...created, linked_count: 3 }),
    };
    usecase = new CreateOperationUsecase({ bddService } as never);
  });

  it('crée une opération sans lien quand aucun n’est demandé', async () => {
    const result = await usecase.execute(base);

    expect(result).toEqual(created);
    expect(bddService.createOperationLinks).not.toHaveBeenCalled();
    // Pas de lien à poser, donc rien n'a changé depuis l'insertion : la
    // relecture serait un aller-retour pour rien.
    expect(bddService.getOperation).not.toHaveBeenCalled();
  });

  it('relit l’opération après avoir posé ses liens', async () => {
    const result = await usecase.execute({
      ...base,
      linked_operation_ids: [7],
    });

    // `createOperation` rend l'opération telle qu'elle était AVANT les liens :
    // son `linked_count` vaut 0. Sans relecture, le client afficherait le
    // virement qu'il vient de créer sans les opérations qu'il vient de lui
    // rattacher.
    expect(bddService.getOperation).toHaveBeenCalledWith({
      user_id: 1,
      operation_id: 100,
    });
    expect(result).toEqual({ ...created, linked_count: 3 });
  });

  it('ne pose aucun lien pour une liste vide', async () => {
    await usecase.execute({ ...base, linked_operation_ids: [] });

    expect(bddService.createOperationLinks).not.toHaveBeenCalled();
  });

  it('lie les opérations au virement qui vient d’être créé', async () => {
    await usecase.execute({ ...base, linked_operation_ids: [7, 8, 9] });

    // `operation_id` vient de l'entité RENDUE par createOperation, jamais du
    // DTO : c'est l'identifiant que la base a attribué.
    expect(bddService.createOperationLinks).toHaveBeenCalledWith({
      user_id: 1,
      operation_id: 100,
      operation_ref_ids: [7, 8, 9],
    });
  });

  it('ne transmet pas les liens au service de création d’opération', async () => {
    await usecase.execute({ ...base, linked_operation_ids: [7] });

    // Le service `createOperation` écrit une ligne d'opération et rien d'autre :
    // lui passer le champ l'aurait exposé à l'insérer comme une colonne.
    expect(bddService.createOperation).toHaveBeenCalledWith(base);
    const passed = bddService.createOperation.mock.calls[0][0];
    expect(passed).not.toHaveProperty('linked_operation_ids');
  });

  it('supprime le virement quand ses liens ne peuvent pas être posés', async () => {
    bddService.createOperationLinks.mockRejectedValue(new Error('SQL_ERROR'));

    await expect(
      usecase.execute({ ...base, linked_operation_ids: [7] }),
    ).rejects.toThrow('SQL_ERROR');

    // Un virement créé sans les opérations qu'il prend en charge est un
    // virement faux, et rien côté client ne le rattraperait.
    expect(bddService.deleteOperation).toHaveBeenCalledWith({
      user_id: 1,
      operation_id: 100,
    });
  });
});
