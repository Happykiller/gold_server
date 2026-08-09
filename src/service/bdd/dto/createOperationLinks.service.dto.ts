export interface CreateOperationLinksServiceDto {
  user_id: number;
  /** L'opération portante — en pratique le virement. */
  operation_id: number;
  /** Les opérations qu'elle prend en charge. */
  operation_ref_ids: number[];
}
