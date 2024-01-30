import { CloneOperationInputResolver } from '@presentation/operation/operation.resolver';

export interface CloneOperationsUsecaseDto extends CloneOperationInputResolver {
  user_id: number
}