/**
 * Mise à jour partielle d'un compte.
 *
 * Seuls l'utilisateur et le compte sont requis : l'input GraphQL déclare tous
 * les autres champs nullables, et le service SQL conserve la valeur existante
 * pour ceux qui ne sont pas fournis. Le DTO les déclarait pourtant obligatoires
 * — il décrivait donc un appel que le resolver ne fait jamais.
 */
export interface UpdateAccountUsecaseDto {
  user_id: number;
  account_id: number;
  type_id?: number;
  parent_account_id?: number;
  label?: string;
  description?: string;
}
