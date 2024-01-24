export interface UserUsecaseModel {
  id: number;
  code: string;
  password: string;
  name_first: string;
  name_last: string;
  description: string;
  mail: string;
  active: boolean;
  creation: string;
  modification: string;
  language: string;
}