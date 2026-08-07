/**
 * Mise à jour partielle d'un compte, côté service.
 *
 * Même forme que le DTO usecase : `updateAccount` relit le compte existant et
 * conserve la valeur en place pour chaque champ absent. Les déclarer requis
 * décrivait un appel que personne ne fait.
 */
export interface UpdateAccountServiceDto {
  user_id: number;
  account_id: number;
  type_id?: number;
  parent_account_id?: number;
  label?: string;
  description?: string;
}
