import { ERRORS } from '@src/common/ERROR';
import { Inversify } from '@src/inversify/investify';
import { UpdateAccountUsecase } from './updateAccount.usecase';
import { UpdateAccountUsecaseDto } from './dto/updateAccount.usecase.dto';

describe('UpdateAccountUsecase', () => {
  let inversify: Inversify;
  let usecase: UpdateAccountUsecase;
  let bddServiceFake: any;

  const dto: UpdateAccountUsecaseDto = {
    account_id: 3,
    user_id: 1,
    label: 'Livret',
  };

  const existing = {
    id: 3,
    label: 'Ancien libellé',
    type_id: 1,
    parent_account_id: null,
    description: 'une description',
  };

  beforeEach(() => {
    bddServiceFake = {
      getAccount: jest.fn(),
      updateAccount: jest.fn(),
    };

    inversify = {
      bddService: bddServiceFake as any,
    } as any;

    usecase = new UpdateAccountUsecase(inversify);
  });

  it('met à jour un compte existant', async () => {
    const updated = { ...existing, label: 'Livret' };
    bddServiceFake.getAccount.mockResolvedValue(existing);
    bddServiceFake.updateAccount.mockResolvedValue(updated);

    const result = await usecase.execute(dto);

    expect(bddServiceFake.getAccount).toHaveBeenCalledWith({
      account_id: 3,
      user_id: 1,
    });
    expect(bddServiceFake.updateAccount).toHaveBeenCalledWith(dto);
    expect(result).toEqual(updated);
  });

  it('refuse un compte inexistant par une erreur métier', async () => {
    bddServiceFake.getAccount.mockResolvedValue(null);

    await expect(usecase.execute(dto)).rejects.toThrow(
      ERRORS.ACCOUNT_NOT_FOUND,
    );
  });

  it("n'écrit rien quand le compte est introuvable", async () => {
    bddServiceFake.getAccount.mockResolvedValue(null);

    await expect(usecase.execute(dto)).rejects.toThrow();

    expect(bddServiceFake.updateAccount).not.toHaveBeenCalled();
  });

  it("traite le compte d'un autre utilisateur comme inexistant", async () => {
    // getAccount filtre sur le créateur : ne pas distinguer les deux cas évite
    // de révéler l'existence d'un compte qu'on ne possède pas.
    bddServiceFake.getAccount.mockResolvedValue(null);

    await expect(usecase.execute({ ...dto, user_id: 999 })).rejects.toThrow(
      ERRORS.ACCOUNT_NOT_FOUND,
    );
  });
});
