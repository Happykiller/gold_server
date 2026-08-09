import { DeleteOperationLinkUsecase } from '@usecase/deleteOperationLink.usecase';

describe('DeleteOperationLinkUsecase', () => {
  let bddService: {
    getOperationLink: jest.Mock;
    deleteOperationLink: jest.Mock;
  };
  let usecase: DeleteOperationLinkUsecase;

  beforeEach(() => {
    bddService = {
      getOperationLink: jest.fn(),
      deleteOperationLink: jest.fn().mockResolvedValue(true),
    };
    usecase = new DeleteOperationLinkUsecase({ bddService } as never);
  });

  it('retire un lien existant', async () => {
    bddService.getOperationLink.mockResolvedValue({ id: 7, creator_id: 1 });

    const result = await usecase.execute({ operation_link_id: 7, user_id: 1 });

    expect(result).toBe(true);
    expect(bddService.deleteOperationLink).toHaveBeenCalledWith({
      operation_link_id: 7,
      user_id: 1,
    });
  });

  it('n’écrit rien quand le lien n’existe pas', async () => {
    bddService.getOperationLink.mockResolvedValue(null);

    const result = await usecase.execute({
      operation_link_id: 999,
      user_id: 1,
    });

    expect(result).toBe(false);
    expect(bddService.deleteOperationLink).not.toHaveBeenCalled();
  });

  it('traite le lien d’un autre utilisateur comme inexistant', async () => {
    // La lecture est cloisonnée : pour l'utilisateur 2, le lien de
    // l'utilisateur 1 n'existe pas. Les deux cas rendent la même réponse, rien
    // ne permet de les distinguer depuis l'extérieur.
    bddService.getOperationLink.mockResolvedValue(null);

    const result = await usecase.execute({ operation_link_id: 7, user_id: 2 });

    expect(result).toBe(false);
    expect(bddService.getOperationLink).toHaveBeenCalledWith({
      operation_link_id: 7,
      user_id: 2,
    });
    expect(bddService.deleteOperationLink).not.toHaveBeenCalled();
  });
});
