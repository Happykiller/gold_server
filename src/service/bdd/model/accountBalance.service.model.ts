/**
 * Les deux soldes d'un compte, lus séparément de ses colonnes propres.
 *
 * `balance_not_reconcilied` est le solde **projeté** (statuts 1 et 2), et non
 * « ce qui n'est pas pointé » — le nom vient de la base, il n'a pas été changé
 * pour ne pas casser le contrat GraphQL.
 */
export interface AccountBalanceServiceModel {
  account_id: number;
  balance_reconcilied: number;
  balance_not_reconcilied: number;
}
