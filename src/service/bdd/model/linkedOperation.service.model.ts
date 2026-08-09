export interface LinkedOperationServiceModel {
  /** L'identifiant du lien, et non celui de l'opération : il sert au retrait. */
  link_id: number;
  id: number;
  account_id: number;
  account_id_dest: number;
  amount: number;
  date: string;
  status_id: number;
  type_id: number;
  third_id: number;
  category_id: number;
  description: string;
}
