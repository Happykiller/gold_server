export interface UpdateAccountServiceDto {
  user_id: number
  account_id: number
  type_id: number
  parent_account_id: number
  label: string
  description: string
}