import { LinkDirection } from '@service/bdd/dto/getLinkedOperations.service.dto';

export interface GetLinkedOperationsUsecaseDto {
  user_id: number;
  operation_id: number;
  direction: LinkDirection;
}
