import { UpdateOperationInputResolver } from '@presentation/operation/dto/update.operation.resolver.dto';

export interface UpdateOperationUsecaseDto extends UpdateOperationInputResolver {
  user_id: number
}