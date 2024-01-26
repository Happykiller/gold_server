export interface OperationUsecaseModel {
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
  active: boolean;
  creator_id: number;
  creation_date: string;
  modificator_id: number;
  modification_date: string;
}