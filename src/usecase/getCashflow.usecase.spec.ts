import { Inversify } from '@src/inversify/investify';
import { GetCashflowUsecase } from './getCashflow.usecase';
import { CashflowUsecaseDto } from './dto/cashflow.usecase.dto';
import { CashflowUsecaseModel } from './model/cashflow.usecase.model';

describe('GetCashflowUsecase', () => {
    let inversify: Inversify;
    let usecase: GetCashflowUsecase;
    let bddServiceFake: any;

    beforeEach(() => {
        bddServiceFake = {
            getCashflow: jest.fn()
        };

        inversify = {
            bddService: bddServiceFake as any
        } as any;

        usecase = new GetCashflowUsecase(inversify);
    });

    it('should call the bddService and return the cashflow array', async () => {
        const dto: CashflowUsecaseDto = {
            account_ids: [1, 2],
            start_date: '2023-01-01',
            end_date: '2023-01-10',
            user_id: 1,
        };

        const mockResult: CashflowUsecaseModel[] = [
            { account_id: 1, date: '2023-01-01', reconciled_balance: 100, total_balance: 150 },
            { account_id: 1, date: '2023-01-02', reconciled_balance: 100, total_balance: 200 },
            { account_id: 2, date: '2023-01-01', reconciled_balance: 50, total_balance: 50 },
            { account_id: 2, date: '2023-01-02', reconciled_balance: 60, total_balance: 80 }
        ];

        bddServiceFake.getCashflow.mockResolvedValue(mockResult);

        const result = await usecase.execute(dto);

        expect(bddServiceFake.getCashflow).toHaveBeenCalledWith(dto);
        expect(result).toEqual(mockResult);
    });
});
