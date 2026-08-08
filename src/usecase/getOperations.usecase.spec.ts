import { Inversify } from '@src/inversify/investify';
import {
  GetOperationsUsecase,
  MAX_OPERATIONS_LIMIT,
} from './getOperations.usecase';
import { GetOperationsUsecaseDto } from './dto/getOperations.usecase.dto';

describe('GetOperationsUsecase', () => {
  let inversify: Inversify;
  let usecase: GetOperationsUsecase;
  let bddServiceFake: any;

  const baseDto: GetOperationsUsecaseDto = {
    user_id: 1,
    account_id: 2,
    limit: 50,
    offset: 0,
  };

  beforeEach(() => {
    bddServiceFake = { getOperations: jest.fn().mockResolvedValue([]) };
    inversify = { bddService: bddServiceFake as any } as any;
    usecase = new GetOperationsUsecase(inversify);
  });

  it('transmet les critères au service sans les altérer', async () => {
    const dto: GetOperationsUsecaseDto = {
      ...baseDto,
      category_ids: [7],
      amount_min: 50,
      text: 'alimentation',
    };

    await usecase.execute(dto);

    expect(bddServiceFake.getOperations).toHaveBeenCalledWith(
      expect.objectContaining({
        category_ids: [7],
        amount_min: 50,
        text: 'alimentation',
      }),
    );
  });

  it('plafonne une limite déraisonnable', async () => {
    // Le défaut de l'input GraphQL est une valeur par défaut, pas un maximum :
    // sans ce clamp, la valeur atterrissait telle quelle dans le LIMIT du SQL.
    await usecase.execute({ ...baseDto, limit: 1_000_000 });

    expect(bddServiceFake.getOperations).toHaveBeenCalledWith(
      expect.objectContaining({ limit: MAX_OPERATIONS_LIMIT }),
    );
  });

  it('laisse passer une limite raisonnable', async () => {
    await usecase.execute({ ...baseDto, limit: 50 });

    expect(bddServiceFake.getOperations).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 50 }),
    );
  });

  it('refuse une limite ou un offset négatifs', async () => {
    // `LIMIT -1` est une erreur de syntaxe MySQL, pas une requête vide.
    await usecase.execute({ ...baseDto, limit: -1, offset: -10 });

    expect(bddServiceFake.getOperations).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 0, offset: 0 }),
    );
  });
});
