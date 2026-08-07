import { ERRORS } from '@src/common/ERROR';
import { Inversify } from '@src/inversify/investify';
import { UpdateOperationUsecase } from './UpdateOperation.usecase';
import { UpdateOperationUsecaseDto } from './dto/updateOperation.usecase.dto';

describe('UpdateOperationUsecase', () => {
  let inversify: Inversify;
  let usecase: UpdateOperationUsecase;
  let bddServiceFake: any;

  const dto: UpdateOperationUsecaseDto = {
    operation_id: 42,
    user_id: 1,
    amount: 25.5,
  };

  const existing = {
    id: 42,
    account_id: 7,
    account_id_dest: null,
    amount: 10,
    date: '2026-08-01',
    status_id: 1,
    type_id: 2,
    third_id: null,
    category_id: null,
    vat_rate: 20,
    description: 'avant',
  };

  beforeEach(() => {
    bddServiceFake = {
      getOperation: jest.fn(),
      updateOperation: jest.fn(),
    };

    inversify = {
      bddService: bddServiceFake as any,
    } as any;

    usecase = new UpdateOperationUsecase(inversify);
  });

  it('met à jour une opération existante', async () => {
    const updated = { ...existing, amount: 25.5, description: 'après' };
    bddServiceFake.getOperation.mockResolvedValue(existing);
    bddServiceFake.updateOperation.mockResolvedValue(updated);

    const result = await usecase.execute(dto);

    expect(bddServiceFake.getOperation).toHaveBeenCalledWith({
      operation_id: 42,
      user_id: 1,
    });
    expect(bddServiceFake.updateOperation).toHaveBeenCalledWith(dto);
    expect(result).toEqual(updated);
  });

  it('refuse une opération inexistante par une erreur métier', async () => {
    // Le service relit l'opération pour combler les champs absents du dto.
    // Sans garde, l'accès aux champs de `null` remontait au client en
    // « Cannot read properties of null », une erreur interne illisible.
    bddServiceFake.getOperation.mockResolvedValue(null);

    await expect(usecase.execute(dto)).rejects.toThrow(
      ERRORS.OPERATION_NOT_FOUND,
    );
  });

  it("n'écrit rien quand l'opération est introuvable", async () => {
    bddServiceFake.getOperation.mockResolvedValue(null);

    await expect(usecase.execute(dto)).rejects.toThrow();

    expect(bddServiceFake.updateOperation).not.toHaveBeenCalled();
  });

  it("traite l'opération d'un autre utilisateur comme inexistante", async () => {
    // getOperation filtre sur creator_id : ne pas distinguer les deux cas
    // évite de révéler l'existence d'une opération qu'on ne possède pas.
    bddServiceFake.getOperation.mockResolvedValue(null);

    await expect(usecase.execute({ ...dto, user_id: 999 })).rejects.toThrow(
      ERRORS.OPERATION_NOT_FOUND,
    );
  });
});
