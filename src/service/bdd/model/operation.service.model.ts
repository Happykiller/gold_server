export interface OperationServiceModel {
  id: number;
  account_id: number;
  account_id_dest: number;
  amount: number;
  date: string;
  status_id: number;
  type_id: number;
  third_id: number;
  category_id: number;
  vat_rate: number;
  description: string;
  active: boolean;
  creator_id: number;
  creation_date: string;
  modificator_id: number;
  modification_date: string;
  /** Nombre d'opérations que celle-ci prend en charge (cas du virement). */
  linked_count: number;
  /** Nombre de virements qui prennent celle-ci en charge. */
  linked_by_count: number;
}
