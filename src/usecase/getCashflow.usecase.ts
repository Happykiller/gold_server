import { Inversify } from '@src/inversify/investify';
import { CashflowUsecaseModel } from '@usecase/model/cashflow.usecase.model';
import { CashflowUsecaseDto } from '@usecase/dto/cashflow.usecase.dto';

export class GetCashflowUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: CashflowUsecaseDto): Promise<CashflowUsecaseModel[]> {
    return await this.inversify.bddService.getCashflow(dto);
  }
}
