import { UpdateOperationInputResolver } from '@presentation/operation/operation.resolver'

export interface UpdateOperationUsecaseDto extends UpdateOperationInputResolver {
  user_id: number
}