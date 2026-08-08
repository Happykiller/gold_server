export interface GetOperationsServiceDto {
  user_id: number;
  account_id: number;
  limit: number;
  offset: number;

  // Filtres optionnels, traduits en clauses SQL paramétrées par
  // `buildOperationFilters`.
  category_ids?: number[];
  third_ids?: number[];
  dest_account_ids?: number[];
  type_ids?: number[];
  status_ids?: number[];
  description?: string;
  text?: string;
  amount_min?: number;
  amount_max?: number;
  date_from?: string;
  date_to?: string;
}
