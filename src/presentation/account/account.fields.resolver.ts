// src\presentation\account\account.fields.resolver.ts
import {
  Context,
  Float,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentSession, UserSession } from '@happykiller/sunny-apis';

import inversify from '@src/inversify/investify';
import { AccountModelResolver } from '@presentation/account/account.resolver';
import { cacheOf, RequestCache } from '@src/common/graphql/request.cache';

/**
 * Les deux soldes, résolus seulement quand le client les demande.
 *
 * Ils étaient calculés par le SELECT de `getAccount`/`getAccounts`, donc
 * TOUJOURS — y compris pour les 50 lignes d'une liste d'opérations, dont le
 * front ne lit que `account { id label }`. Chaque calcul balaie l'historique
 * complet du compte : 132 balayages pour afficher une page.
 *
 * Un resolver de champs plutôt qu'une inspection de `@Info` : GraphQL sait
 * déjà répondre à « le client a-t-il demandé ce champ ? », et c'est
 * exactement ce qu'est un field resolver. L'inspection de l'AST reviendrait à
 * réécrire ce mécanisme à la main, fragments et alias compris, et à le
 * brancher sur les six chemins qui rendent un compte.
 *
 * **Le schéma ne bouge pas d'un caractère** : `balance_reconcilied` reste un
 * `Float` nullable. Aucune étape de la procédure de changement de contrat
 * n'est déclenchée, et le front n'est pas touché.
 *
 * Note : une seconde classe est nécessaire parce qu'`AccountResolver` est
 * déclaré `@Resolver('AccountResolver')` — une chaîne. Des `@ResolveField`
 * ajoutés là ne s'attacheraient à aucun type et ne seraient jamais appelés.
 */
@Resolver(() => AccountModelResolver)
export class AccountFieldsResolver {
  private async balancesOf(
    session: UserSession,
    context: { cache?: RequestCache },
  ) {
    const userId = parseInt(session.id);
    // La clé porte le user_id : le contexte est déjà propre à une requête,
    // donc à un utilisateur, mais rendre la fuite structurellement impossible
    // vaut mieux que la rendre seulement improbable (loi 1).
    return cacheOf(context).get(`accounts-balances:${userId}`, () =>
      inversify.getAccountsBalancesUsecase.execute({ user_id: userId }),
    );
  }

  @ResolveField(() => Float, { nullable: true })
  async balance_reconcilied(
    @Parent() parent: AccountModelResolver,
    @CurrentSession() session: UserSession,
    @Context() context: { cache?: RequestCache },
  ): Promise<number> {
    // Un appelant qui a déjà le solde en main le garde : le fake le fournit
    // sur la ligne, et un futur SELECT pourrait le refaire.
    if (parent.balance_reconcilied !== undefined) {
      return parent.balance_reconcilied;
    }
    const balances = await this.balancesOf(session, context);
    return balances.get(parent.id)?.balance_reconcilied ?? 0;
  }

  @ResolveField(() => Float, { nullable: true })
  async balance_not_reconcilied(
    @Parent() parent: AccountModelResolver,
    @CurrentSession() session: UserSession,
    @Context() context: { cache?: RequestCache },
  ): Promise<number> {
    if (parent.balance_not_reconcilied !== undefined) {
      return parent.balance_not_reconcilied;
    }
    const balances = await this.balancesOf(session, context);
    return balances.get(parent.id)?.balance_not_reconcilied ?? 0;
  }
}
