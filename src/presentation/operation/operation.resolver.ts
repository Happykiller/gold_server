// src\presentation\operation\operation.resolver.ts
import { UseGuards } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import {
  Mutation,
  Query,
  Resolver,
  Args,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';

import { ERRORS } from '@src/common/ERROR';

import inversify from '@src/inversify/investify';
import { cacheOf, RequestCache } from '@src/common/graphql/request.cache';
import { AccountModelResolver } from '@presentation/account/account.resolver';
import {
  CurrentSession,
  makeAuthGuard,
  USER_ROLE,
  UserSession,
} from '@happykiller/sunny-apis';
import { OperationModelResolver } from '@presentation/operation/model/operation.resolver.model';
import { GetOperationInputResolver } from '@presentation/operation/dto/get.operation.resolver.dto';
import { GetOperationsInputResolver } from '@presentation/operation/dto/getAll.operation.resolver.dto';
import { CloneOperationInputResolver } from '@presentation/operation/dto/clone.operation.resolver.dto';
import { OperationLinkModelResolver } from '@presentation/operation/model/operationLink.resolver.model';
import { LinkedOperationModelResolver } from '@presentation/operation/model/linkedOperation.resolver.model';
import { LINK_DIRECTION } from '@service/bdd/dto/getLinkedOperations.service.dto';
import { OperationTypeModelResolver } from '@presentation/operation/model/operationType.resolver.model';
import { CreateOperationInputResolver } from '@presentation/operation/dto/create.operation.resolver.dto';
import { UpdateOperationInputResolver } from '@presentation/operation/dto/update.operation.resolver.dto';
import { OperationThirdModelResolver } from '@presentation/operation/model/operationThrid.resolver.model';
import { GetOperationLinkInputResolver } from '@presentation/operation/dto/get.operationLink.resolver.dto';
import { OperationStatutModelResolver } from '@presentation/operation/model/operationStatut.resolver.model';
import { OperationCategoryModelResolver } from '@presentation/operation/model/operationCategory.resolver.model';
import { CreateOperationLinkInputResolver } from '@presentation/operation/dto/create.operationLink.resolver.dto';
import { CashflowModelResolver } from '@presentation/operation/model/cashflow.resolver.model';
import { CashflowInputResolver } from '@presentation/operation/dto/cashflow.resolver.dto';
import { OperationChangeKind } from '@service/event/operationEvent.service';

/**
 * Ce qu'une mutation lit dans le contexte : l'en-tête que le front pose pour se
 * reconnaître dans les événements qu'il déclenche.
 */
interface MutationContext {
  req?: { headers?: Record<string, string | string[] | undefined> };
}

/** Les comptes concernés par un lot d'opérations, sans doublon ni trou. */
const accountsOf = (
  operations: Pick<OperationModelResolver, 'account_id' | 'account_id_dest'>[],
): number[] => [
  ...new Set(
    operations
      .flatMap((operation) => [operation.account_id, operation.account_id_dest])
      .filter((id): id is number => typeof id === 'number'),
  ),
];

@Resolver((of) => OperationModelResolver)
export class OperationResolver {
  /**
   * Prévient les clients de cet utilisateur qu'une opération a bougé.
   *
   * Publié depuis la présentation et non depuis le usecase, pour deux raisons :
   * le usecase n'a aucun accès à la requête, donc pas à l'onglet émetteur ; et
   * c'est ici qu'on tient déjà le résultat de la mutation, donc les comptes
   * touchés. Le métier reste ignorant du fait qu'on l'écoute.
   *
   * Ne lève jamais : un abonné qui écoute mal ne doit pas faire échouer une
   * écriture déjà commise en base.
   */
  private notify(
    session: UserSession,
    context: MutationContext,
    kind: OperationChangeKind,
    touched: { account_ids?: number[]; operation_ids?: number[] },
  ): void {
    const origin = context?.req?.headers?.['x-gold-client'];
    inversify.operationEventService.publish(parseInt(session.id), {
      kind,
      account_ids: touched.account_ids ?? [],
      operation_ids: touched.operation_ids ?? [],
      origin: typeof origin === 'string' ? origin : null,
    });
  }

  /**
   * Les comptes de l'utilisateur, indexés par id, chargés UNE fois par requête.
   *
   * Ces deux resolvers s'exécutent par ligne : sur un lot de 50 opérations,
   * c'était 66 lectures de compte, dont chacune calculait deux soldes en
   * balayant tout l'historique. Le lot entier tenait dans une seule lecture —
   * les 50 lignes d'une page portent une poignée de comptes distincts.
   */
  private async accountsById(
    session: UserSession,
    context: { cache?: RequestCache },
  ): Promise<Map<number, AccountModelResolver>> {
    const userId = parseInt(session.id);
    return cacheOf(context).get(`accounts-by-id:${userId}`, async () => {
      const accounts = await inversify.getAccountsUsecase.execute({
        user_id: userId,
      });
      return new Map(accounts.map((account) => [account.id, account]));
    });
  }

  @ResolveField((of) => AccountModelResolver)
  async account(
    @Parent() parent: OperationModelResolver,
    @CurrentSession() session: UserSession,
    @Context() context: { cache?: RequestCache },
  ): Promise<AccountModelResolver> {
    const accounts = await this.accountsById(session, context);
    // `?? null` : `getAccountUsecase` rendait null pour un compte absent ou
    // appartenant à un autre utilisateur. Le comportement est conservé, y
    // compris le fait qu'il viole le `AccountModelResolver!` du schéma —
    // corriger cette nullabilité touche le contrat, et se traite à part.
    return accounts.get(parent.account_id) ?? null;
  }

  @ResolveField((of) => AccountModelResolver, { nullable: true })
  async account_dest(
    @Parent() parent: OperationModelResolver,
    @CurrentSession() session: UserSession,
    @Context() context: { cache?: RequestCache },
  ): Promise<AccountModelResolver> {
    if (parent.account_id_dest === null) return null;
    const accounts = await this.accountsById(session, context);
    return accounts.get(parent.account_id_dest) ?? null;
  }

  /**
   * Un référentiel indexé par id, chargé UNE fois par requête.
   *
   * Les quatre resolvers ci-dessous rechargeaient chacun leur référentiel
   * ENTIER pour chaque ligne, puis cherchaient une entrée en JavaScript : 100
   * requêtes SQL par lot de 50, pour des données qui tiennent en mémoire et ne
   * changent pas pendant une requête.
   *
   * Une `Map` plutôt que le tableau brut : le `.find()` par ligne restait
   * gratuit à cette taille, mais l'index rend le coût indépendant du nombre
   * d'entrées, et dit mieux ce que fait l'appel.
   */
  private async refById<T extends { id: number }>(
    key: string,
    context: { cache?: RequestCache },
    load: () => Promise<T[]>,
  ): Promise<Map<number, T>> {
    return cacheOf(context).get(key, async () => {
      const entries = await load();
      return new Map(entries.map((entry) => [entry.id, entry]));
    });
  }

  @ResolveField((of) => OperationStatutModelResolver)
  async status(
    @Parent() parent: OperationModelResolver,
    @Context() context: { cache?: RequestCache },
  ): Promise<OperationStatutModelResolver> {
    // Seul référentiel sans user_id : sa clé n'en porte donc pas non plus.
    const statuses = await this.refById('operation-status', context, () =>
      inversify.getOperationStatusUsecase.execute(),
    );
    return statuses.get(parent.status_id);
  }

  @ResolveField((of) => OperationTypeModelResolver)
  async type(
    @Parent() parent: OperationModelResolver,
    @CurrentSession() session: UserSession,
    @Context() context: { cache?: RequestCache },
  ): Promise<OperationTypeModelResolver> {
    const userId = parseInt(session.id);
    const types = await this.refById(`operation-types:${userId}`, context, () =>
      inversify.getOperationTypesUsecase.execute({ user_id: userId }),
    );
    return types.get(parent.type_id);
  }

  @ResolveField((of) => OperationThirdModelResolver)
  async third(
    @Parent() parent: OperationModelResolver,
    @CurrentSession() session: UserSession,
    @Context() context: { cache?: RequestCache },
  ): Promise<OperationThirdModelResolver> {
    const userId = parseInt(session.id);
    const thirds = await this.refById(
      `operation-thirds:${userId}`,
      context,
      () => inversify.getOperationThridsUsecase.execute({ user_id: userId }),
    );
    return thirds.get(parent.third_id);
  }

  @ResolveField((of) => OperationCategoryModelResolver)
  async category(
    @Parent() parent: OperationModelResolver,
    @CurrentSession() session: UserSession,
    @Context() context: { cache?: RequestCache },
  ): Promise<OperationCategoryModelResolver> {
    const userId = parseInt(session.id);
    const categories = await this.refById(
      `operation-categories:${userId}`,
      context,
      () =>
        inversify.getOperationCategoriesUsecase.execute({ user_id: userId }),
    );
    return categories.get(parent.category_id);
  }

  /**
   * Les opérations que ce virement prend en charge.
   *
   * Une requête SQL, et seulement si le client la demande : l'écran de liste ne
   * la demande pas, il lit `linked_count`, calculé dans la même requête que les
   * lignes. Seul le détail descend jusqu'ici.
   */
  @ResolveField(
    /* istanbul ignore next */
    () => [LinkedOperationModelResolver],
  )
  async linked_operations(
    @Parent() parent: OperationModelResolver,
    @CurrentSession() session: UserSession,
  ): Promise<LinkedOperationModelResolver[]> {
    return inversify.getLinkedOperationsUsecase.execute({
      user_id: parseInt(session.id),
      operation_id: parent.id,
      direction: LINK_DIRECTION.DOWN,
    });
  }

  /** Les virements qui prennent cette opération en charge. */
  @ResolveField(
    /* istanbul ignore next */
    () => [LinkedOperationModelResolver],
  )
  async linked_by_operations(
    @Parent() parent: OperationModelResolver,
    @CurrentSession() session: UserSession,
  ): Promise<LinkedOperationModelResolver[]> {
    return inversify.getLinkedOperationsUsecase.execute({
      user_id: parseInt(session.id),
      operation_id: parent.id,
      direction: LINK_DIRECTION.UP,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => [OperationModelResolver],
  )
  async operations(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: GetOperationsInputResolver,
  ): Promise<OperationModelResolver[]> {
    return inversify.getOperationsUsecase.execute({
      user_id: parseInt(session.id),
      ...dto,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => [CashflowModelResolver],
  )
  async cashflow(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: CashflowInputResolver,
  ): Promise<CashflowModelResolver[]> {
    return inversify.getCashflowUsecase.execute({
      user_id: parseInt(session.id),
      ...dto,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => OperationModelResolver,
  )
  async operation(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: GetOperationInputResolver,
  ): Promise<OperationModelResolver> {
    return inversify.getOperationUsecase.execute({
      user_id: parseInt(session.id),
      ...dto,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(
    /* istanbul ignore next */
    () => OperationModelResolver,
  )
  async createOperation(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: CreateOperationInputResolver,
    @Context() context: MutationContext,
  ): Promise<OperationModelResolver> {
    const operation = await inversify.createOperationUsecase.execute({
      user_id: parseInt(session.id),
      ...dto,
    });
    this.notify(session, context, 'created', {
      account_ids: accountsOf([operation]),
      operation_ids: [operation.id],
    });
    return operation;
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(
    /* istanbul ignore next */
    () => OperationModelResolver,
  )
  async updateOperation(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: UpdateOperationInputResolver,
    @Context() context: MutationContext,
  ): Promise<OperationModelResolver> {
    try {
      const operation = await inversify.updateOperationUsecase.execute({
        user_id: parseInt(session.id),
        ...dto,
      });
      this.notify(session, context, 'updated', {
        account_ids: accountsOf([operation]),
        operation_ids: [operation.id],
      });
      return operation;
    } catch (e) {
      // Le usecase reste indépendant du framework : c'est ici, dans la couche
      // de présentation, qu'une erreur métier devient un refus GraphQL typé.
      // Sans cette traduction, le client reçoit un INTERNAL_SERVER_ERROR et ne
      // peut pas distinguer une opération inconnue d'une panne du serveur.
      if (e instanceof Error && e.message === ERRORS.OPERATION_NOT_FOUND) {
        throw new GraphQLError(ERRORS.OPERATION_NOT_FOUND, {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      throw e;
    }
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(
    /* istanbul ignore next */
    () => Boolean,
  )
  async deleteOperation(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: GetOperationInputResolver,
    @Context() context: MutationContext,
  ): Promise<boolean> {
    const deleted = await inversify.deleteOperationUsecase.execute({
      user_id: parseInt(session.id),
      operation_id: dto.operation_id,
    });
    // Sans `account_ids` : la suppression est logique et ne rend qu'un booléen.
    // Les relire coûterait une lecture pour épargner au client un rechargement
    // qu'il fait de toute façon quand la liste affichée est concernée.
    this.notify(session, context, 'deleted', {
      operation_ids: [dto.operation_id],
    });
    return deleted;
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => [OperationTypeModelResolver],
  )
  async operationTypes(
    @CurrentSession() session: UserSession,
  ): Promise<OperationTypeModelResolver[]> {
    return inversify.getOperationTypesUsecase.execute({
      user_id: parseInt(session.id),
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => [OperationCategoryModelResolver],
  )
  async operationCategories(
    @CurrentSession() session: UserSession,
  ): Promise<OperationCategoryModelResolver[]> {
    return inversify.getOperationCategoriesUsecase.execute({
      user_id: parseInt(session.id),
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => [OperationStatutModelResolver],
  )
  async operationStatus(): Promise<OperationStatutModelResolver[]> {
    return inversify.getOperationStatusUsecase.execute();
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => [OperationThirdModelResolver],
  )
  async operationThirds(
    @CurrentSession() session: UserSession,
  ): Promise<OperationThirdModelResolver[]> {
    return inversify.getOperationThridsUsecase.execute({
      user_id: parseInt(session.id),
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => [OperationLinkModelResolver],
  )
  async operationLinks(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: GetOperationInputResolver,
  ): Promise<OperationLinkModelResolver[]> {
    return inversify.getOperationLinksUsecase.execute({
      user_id: parseInt(session.id),
      operation_id: dto.operation_id,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(
    /* istanbul ignore next */
    () => OperationLinkModelResolver,
  )
  async createOperationLink(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: CreateOperationLinkInputResolver,
    @Context() context: MutationContext,
  ): Promise<OperationLinkModelResolver> {
    const link = await inversify.createOperationLinkUsecase.execute({
      user_id: parseInt(session.id),
      ...dto,
    });
    // Un lien ne porte pas de compte, mais il déplace les compteurs
    // `linked_count` / `linked_by_count` des deux opérations qu'il joint : la
    // liste doit se relire.
    this.notify(session, context, 'linked', {
      operation_ids: [dto.operation_id, dto.operation_ref_id],
    });
    return link;
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(
    /* istanbul ignore next */
    () => Boolean,
  )
  async deleteOperationLink(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: GetOperationLinkInputResolver,
    @Context() context: MutationContext,
  ): Promise<boolean> {
    const deleted = await inversify.deleteOperationLinkUsecase.execute({
      user_id: parseInt(session.id),
      operation_link_id: dto.operation_link_id,
    });
    this.notify(session, context, 'linked', {});
    return deleted;
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(
    /* istanbul ignore next */
    () => [OperationModelResolver],
  )
  async cloneOperations(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: CloneOperationInputResolver,
    @Context() context: MutationContext,
  ): Promise<OperationModelResolver[]> {
    const operations = await inversify.cloneOperationsUsecase.execute({
      user_id: parseInt(session.id),
      ...dto,
    });
    this.notify(session, context, 'cloned', {
      account_ids: accountsOf(operations),
      operation_ids: operations.map((operation) => operation.id),
    });
    return operations;
  }
}
