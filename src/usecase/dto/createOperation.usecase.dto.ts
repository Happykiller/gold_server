export interface CreateOperationUsecaseDto {
  user_id: number;
  account_id: number;
  account_id_dest: number;
  amount: number;
  date: string;
  status_id: number;
  type_id: number;
  third_id: number;
  category_id: number;
  vat_rate?: number;
  description: string;
  /**
   * Les opérations que cette opération prend en charge — le cas d'usage est le
   * virement qui rembourse des dépenses déjà pointées.
   *
   * Le champ ne descend pas jusqu'à `CreateOperationServiceDto` : le service
   * `createOperation` n'a pas à connaître les liens, c'est le usecase qui
   * orchestre les deux écritures.
   */
  linked_operation_ids?: number[];
}
