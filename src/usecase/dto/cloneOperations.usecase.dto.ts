import { CloneOperationInputResolver } from '@presentation/operation/dto/clone.operation.resolver.dto';

export interface CloneOperationsUsecaseDto extends CloneOperationInputResolver {
  user_id: number
}