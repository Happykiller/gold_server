/**
 * Le sens de lecture d'un lien.
 *
 * `DOWN` : les opérations que l'opération courante prend en charge — on part de
 * `operation_id` pour rejoindre `operation_ref_id`. C'est la vue d'un virement.
 * `UP` : les virements qui prennent l'opération courante en charge — l'inverse.
 */
export const LINK_DIRECTION = {
  DOWN: 'DOWN',
  UP: 'UP',
} as const;

export type LinkDirection =
  (typeof LINK_DIRECTION)[keyof typeof LINK_DIRECTION];

export interface GetLinkedOperationsServiceDto {
  user_id: number;
  operation_id: number;
  direction: LinkDirection;
}
