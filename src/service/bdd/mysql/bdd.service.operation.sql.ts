// src\service\bdd\bdd.service.operation.sql.ts
import { OperationServiceModel } from '@service/bdd/model/operation.service.model';
import { GetOperationServiceDto } from '@service/bdd/dto/getOperation.service.dto';
import { GetOperationsServiceDto } from '@service/bdd/dto/getOperations.service.dto';
import { GetCashflowServiceDto } from '@service/bdd/dto/getCashflow.service.dto';
import { CashflowServiceModel } from '@service/bdd/model/cashflow.service.model';
import { CloneOperationsServiceDto } from '@service/bdd/dto/cloneOperations.service.dto';
import { CreateOperationServiceDto } from '@service/bdd/dto/createOperation.service.dto';
import { UpdateOperationServiceDto } from '@service/bdd/dto/updateOperation.service.dto';
import { DeleteOperationServiceDto } from '@service/bdd/dto/deleteOperation.service.dto';
import { GetOperationLinkServiceDto } from '@service/bdd/dto/getOperationLink.service.dto';
import { OperationLinkServiceModel } from '@service/bdd/model/operationLink.service.model';
import { OperationTypeServiceModel } from '@service/bdd/model/operationType.service.model';
import { OperationThridServiceModel } from '@service/bdd/model/operationThrid.service.model';
import { GetOperationLinksServiceDto } from '@service/bdd/dto/getOperationLinks.service.dto';
import { OperationStatutServiceModel } from '@service/bdd/model/operationStatut.service.model';
import { DeleteOperationLinkServiceDto } from '@service/bdd/dto/deleteOperationLink.service.dto';
import { CreateOperationLinkServiceDto } from '@service/bdd/dto/createOperationLink.service.dto';
import { CreateOperationLinksServiceDto } from '@service/bdd/dto/createOperationLinks.service.dto';
import { LinkedOperationServiceModel } from '@service/bdd/model/linkedOperation.service.model';
import {
  GetLinkedOperationsServiceDto,
  LINK_DIRECTION,
} from '@service/bdd/dto/getLinkedOperations.service.dto';
import { GetOperationThridsServiceDto } from '@service/bdd/dto/getOperationThrids.service.dto';
import { GetOperationTypesServiceDto } from '@service/bdd/dto/getOperationTypes.service.dto';
import { GetOperationCategoriesServiceDto } from '@service/bdd/dto/getOperationCategories.service.dto';
import { OperationCategoryServiceModel } from '@service/bdd/model/operationCategory.service.model';

/**
 * Les deux compteurs de liens d'une opération, à corréler sur un alias de la
 * table `operation`.
 *
 * Trois requêtes produisent un `OperationServiceModel` — `getOperations`,
 * `getOperation` et `cloneOperations` — et les deux champs sont non nullables
 * au schéma : les oublier dans l'une d'elles ne casse que l'écran qu'elle sert.
 * D'où ce fragment unique plutôt que trois copies vouées à diverger.
 *
 * `alias` n'est jamais une saisie : c'est un littéral écrit ici même, à côté de
 * chaque appel. Aucun paramètre `?` n'est ajouté — les sous-requêtes se
 * corrèlent sur `<alias>.creator_id` — ce qui laisse intacts les tableaux de
 * liaisons des trois appelants. Un `?` inséré dans une liste SELECT viendrait
 * textuellement AVANT ceux du FROM et décalerait tout le reste.
 *
 * La jointure sur `operation` n'est pas décorative : des liens actifs pointent
 * vers des opérations supprimées logiquement. Sans elle, un virement
 * annoncerait « 3 » là où son détail n'en listerait que 2.
 */
const linkCountColumns = (alias: string) => `
    (SELECT COUNT(*)
       FROM operation_link l
       JOIN operation r ON r.id = l.operation_ref_id AND r.active = 1
      WHERE l.active = 1
        AND l.creator_id = ${alias}.creator_id
        AND l.operation_id = ${alias}.id)     AS linked_count,
    (SELECT COUNT(*)
       FROM operation_link l
       JOIN operation r ON r.id = l.operation_id AND r.active = 1
      WHERE l.active = 1
        AND l.creator_id = ${alias}.creator_id
        AND l.operation_ref_id = ${alias}.id) AS linked_by_count`;

/**
 * Le prédicat de visibilité d'une entrée de référentiel : celles que tout le
 * monde partage, plus celles que l'utilisateur a créées lui-même.
 *
 * **Une entrée partagée s'écrit `NULL` dans trois tables et `0` dans la
 * quatrième**, et ce n'est pas une négligence de données : `creator_id` est
 * nullable sur `operation_status_list`, `operation_third_list` et
 * `operation_category_list`, mais `NOT NULL` sur `operation_type_list` (comme
 * sur `account_type_list`). Cette table ne *peut* pas porter `NULL` — sa
 * sentinelle de « sans créateur » est donc `0`, en base de production comme
 * dans le seed `002-seed`.
 *
 * Ne reconnaître que `NULL` rendait `getOperationTypes` vide pour tout
 * utilisateur : crédit, débit et virement portent `creator_id = 0`. Le défaut
 * est resté invisible jusqu'au 08/08/2026 parce que les écrans écrivaient les
 * trois types en dur dans un `Select` ; le jour où ils sont passés sur le
 * référentiel de l'API, le champ Type est devenu un « Aucun résultat ».
 *
 * Aucun paramètre `?` n'est ajouté : `0` est un littéral, la requête garde donc
 * exactement les liaisons de ses appelants.
 */
const sharedOrOwnedBy = (alias: string) =>
  `(${alias}.creator_id IS NULL OR ${alias}.creator_id = 0 OR ${alias}.creator_id = ?)`;

export class BddServiceOperationSQL {
  pool: any;

  constructor(pool: any) {
    this.pool = pool;
  }

  async createOperation(
    dto: CreateOperationServiceDto,
  ): Promise<OperationServiceModel> {
    const query = `INSERT INTO operation (account_id, account_id_dest, amount, date, status_id, type_id, third_id, category_id, vat_rate, description, creator_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ;`;
    const [results] = await this.pool.execute(query, [
      dto.account_id,
      dto.account_id_dest ? dto.account_id_dest : null,
      dto.amount,
      dto.date,
      dto.status_id,
      dto.type_id,
      dto.third_id,
      dto.category_id,
      dto.vat_rate ?? 20,
      dto.description ? dto.description : null,
      dto.user_id,
    ]);
    return await this.getOperation({
      operation_id: results.insertId,
      user_id: dto.user_id,
    });
  }

  async getOperation(
    dto: GetOperationServiceDto,
  ): Promise<OperationServiceModel> {
    const query = `SELECT a.id,
        a.account_id,
        a.account_id_dest,
        a.amount,
        a.date,
        a.status_id,
        a.type_id,
        a.third_id,
        a.category_id,
        a.vat_rate,
        a.description,
        a.creator_id,
        a.creation_date,
        a.modificator_id,
        a.modification_date,
        ${linkCountColumns('a')}
      FROM operation a
      WHERE 1=1
      AND a.active = 1
      AND a.id = ${dto.operation_id}
      AND a.creator_id = ${dto.user_id}
    ;`;
    const [results] = await this.pool.execute(query);
    if (results.length > 0) {
      return results[0];
    } else {
      return null;
    }
  }

  /**
   * Traduit les critères de recherche en clauses SQL **paramétrées**.
   *
   * Rien n'est interpolé : `description` et `text` viennent de la saisie
   * utilisateur, et le reste de ce fichier construit historiquement ses
   * requêtes par interpolation — motif tenable tant que GraphQL coerçait tout
   * en `Int`, intenable dès qu'une chaîne emprunte le même chemin.
   *
   * La clause retournée est destinée aux **deux branches** du UNION de
   * `getOperations` : elle y est insérée deux fois, et les paramètres doivent
   * donc être fournis deux fois, dans le même ordre.
   */
  private buildOperationFilters(dto: GetOperationsServiceDto): {
    clause: string;
    params: unknown[];
  } {
    const parts: string[] = [];
    const params: unknown[] = [];

    // `%` et `_` sont des jokers LIKE : sans échappement, une description
    // contenant « 100% » ou « credit_agricole » élargirait la recherche au
    // lieu de la restreindre.
    const like = (value: string) => `%${value.replace(/[\\%_]/g, '\\$&')}%`;

    const inList = (column: string, ids?: number[] | null) => {
      // Liste vide : critère ignoré. `IN ()` est une erreur de syntaxe MySQL.
      if (!ids || ids.length === 0) return;
      parts.push(`AND ${column} IN (${ids.map(() => '?').join(', ')})`);
      params.push(...ids);
    };

    const compare = (column: string, op: string, value?: number | string) => {
      if (value === undefined || value === null || value === '') return;
      parts.push(`AND ${column} ${op} ?`);
      params.push(value);
    };

    inList('a.category_id', dto.category_ids);
    inList('a.third_id', dto.third_ids);
    inList('a.account_id_dest', dto.dest_account_ids);
    inList('a.type_id', dto.type_ids);
    inList('a.status_id', dto.status_ids);

    compare('a.amount', '>=', dto.amount_min);
    compare('a.amount', '<=', dto.amount_max);
    compare('a.date', '>=', dto.date_from);
    compare('a.date', '<=', dto.date_to);

    if (dto.description) {
      parts.push('AND a.description LIKE ?');
      params.push(like(dto.description));
    }

    if (dto.text) {
      // Recherche large : la description, mais aussi le libellé du tiers et de
      // la catégorie. `EXISTS` plutôt qu'une jointure pour ne pas dupliquer de
      // lignes et laisser les deux branches du UNION intactes.
      parts.push(`AND (
             a.description LIKE ?
          OR EXISTS (SELECT 1 FROM operation_third_list t
                      WHERE t.id = a.third_id AND t.label LIKE ?)
          OR EXISTS (SELECT 1 FROM operation_category_list c
                      WHERE c.id = a.category_id AND c.label LIKE ?)
        )`);
      const pattern = like(dto.text);
      params.push(pattern, pattern, pattern);
    }

    return { clause: parts.join('\n        '), params };
  }

  async getOperations(
    dto: GetOperationsServiceDto,
  ): Promise<OperationServiceModel[]> {
    const filters = this.buildOperationFilters(dto);
    // Les compteurs se calculent dans une enveloppe posée APRÈS le LIMIT, et
    // non dans le SELECT de `h` : le compte le plus chargé porte plus de 7 000
    // opérations, et les sous-requêtes corrélées y seraient évaluées sur toutes
    // les lignes triées avant d'en garder 50. Ici, elles ne voient que la page.
    // L'ordre d'une table dérivée n'étant pas garanti, il se redit à la fin.
    //
    // UNION ALL, et non UNION : le dédoublonnage obligeait MariaDB à
    // matérialiser puis dédoublonner l'historique ENTIER des deux branches
    // avant d'appliquer le LIMIT — 71 ms contre 13 ms sur le compte le plus
    // chargé (10 339 lignes), mesuré le 10/08/2026.
    //
    // La réécriture est une identité, pas un pari sur les données du jour. La
    // branche 1 retient `account_id = ?`, la branche 2 `account_id_dest = ?` :
    // une ligne ne peut sortir des deux que si `account_id = account_id_dest`,
    // et le prédicat ajouté à la seconde branche exclut exactement cette
    // classe de lignes, rien d'autre. Le `IS NULL` couvre le cas d'un
    // `account_id` nul, qu'aucune comparaison ne rendrait vrai. Quant aux
    // doublons de valeurs, ils sont impossibles : `a.id` figure au SELECT.
    // (Vérifié en base ce jour-là : zéro opération d'un compte vers lui-même —
    // ce qui confirme le raisonnement au lieu de lui tenir lieu de preuve.)
    const query = `SELECT
    p.*,
    ${linkCountColumns('p')}
  FROM (
  SELECT
    h.id,
    h.account_id,
    h.account_id_dest,
    h.amount,
    h.date,
    h.status_id,
    h.type_id,
    h.third_id,
    h.category_id,
    h.vat_rate,
    h.description,
    h.active,
    h.creator_id,
    h.creation_date,
    h.modificator_id,
    h.modification_date
  FROM (
    SELECT
      g.id,
      g.account_id,
      g.account_id_dest,
      g.description,
      g.category_id,
      g.status_id,
      g.third_id,
      g.type_id,
      g.vat_rate,
      g.amount,
      g.date,
      g.active,
      g.creator_id,
      g.creation_date,
      g.modificator_id,
      g.modification_date
    FROM (
      SELECT 
        a.id,
        a.amount,
        a.account_id,
        a.account_id_dest,
        a.description,
        a.category_id,
        a.status_id,
        a.third_id,
        a.type_id,
        a.vat_rate,
        a.date,
        a.active,
        a.creator_id,
        a.creation_date,
        a.modificator_id,
        a.modification_date
      FROM operation a
      WHERE 1 = 1
        AND a.account_id = ?
        AND a.creator_id = ?
        AND a.active = 1
        ${filters.clause}
      UNION ALL
      SELECT
        a.id,
        a.amount,
        a.account_id,
        a.account_id_dest,
        a.description,
        a.category_id,
        a.status_id,
        a.third_id,
        a.type_id,
        a.vat_rate,
        a.date,
        a.active,
        a.creator_id,
        a.creation_date,
        a.modificator_id,
        a.modification_date
      FROM operation a
      WHERE 1 = 1
        AND a.account_id_dest = ?
        AND a.creator_id = ?
        AND a.active = 1
        AND (a.account_id IS NULL OR a.account_id <> a.account_id_dest)
        ${filters.clause}
    ) g
  ) h
  WHERE 1=1
  ORDER BY h.date DESC, h.id DESC
  LIMIT ? OFFSET ?
  ) p
  ORDER BY p.date DESC, p.id DESC;`;
    // Ordre des paramètres : branche 1 (compte, créateur, filtres), puis
    // branche 2 à l'identique — la clause de filtre est insérée deux fois,
    // ses paramètres doivent l'être aussi — puis la pagination.
    const [results] = await this.pool.execute(query, [
      dto.account_id,
      dto.user_id,
      ...filters.params,
      dto.account_id,
      dto.user_id,
      ...filters.params,
      dto.limit,
      dto.offset,
    ]);
    return results;
  }

  async getCashflow(
    dto: GetCashflowServiceDto,
  ): Promise<CashflowServiceModel[]> {
    if (!dto.account_ids || dto.account_ids.length === 0) {
      return [];
    }
    const accountIdsJoined = dto.account_ids.join(',');

    const query = `
      WITH RECURSIVE dates AS (
        SELECT CAST(? AS DATE) as date
        UNION ALL
        SELECT DATE_ADD(date, INTERVAL 1 DAY)
        FROM dates
        WHERE DATE_ADD(date, INTERVAL 1 DAY) <= CAST(? AS DATE)
      ),
      accounts AS (
        -- Select only the valid requested accounts belonging to the user
        SELECT id as account_id 
        FROM account 
        WHERE id IN (${accountIdsJoined})
          AND creator_id = ?
          AND active = 1
      ),
      account_dates AS (
        -- Cross join to generate a continuous timeline for EVERY account
        SELECT a.account_id, d.date
        FROM accounts a
        CROSS JOIN dates d
      ),
      operations AS (
        SELECT 
          a.account_id,
          a.date,
          CASE WHEN a.status_id = 2 THEN 
            CASE a.type_id 
              WHEN 1 THEN a.amount 
              WHEN 2 THEN -a.amount 
              WHEN 3 THEN -a.amount 
            END
          ELSE 0 END AS d_reconciled,
          CASE a.type_id 
            WHEN 1 THEN a.amount 
            WHEN 2 THEN -a.amount 
            WHEN 3 THEN -a.amount 
          END AS d_total
        FROM operation a
        WHERE a.account_id IN (${accountIdsJoined})
          AND a.creator_id = ?
          AND a.active = 1
          
        UNION ALL
        
        SELECT 
          a.account_id_dest as account_id,
          a.date,
          CASE WHEN a.status_id = 2 THEN a.amount ELSE 0 END AS d_reconciled,
          a.amount AS d_total
        FROM operation a
        INNER JOIN account b ON a.account_id = b.id
        WHERE a.account_id_dest IN (${accountIdsJoined})
          AND a.creator_id = ?
          AND a.active = 1
          AND b.type_id = 1
      ),
      initial_balance AS (
        SELECT 
          account_id,
          SUM(d_reconciled) as initial_reconciled,
          SUM(d_total) as initial_total
        FROM operations
        WHERE date < CAST(? AS DATE)
        GROUP BY account_id
      ),
      daily_movements AS (
        SELECT 
          account_id,
          CAST(date AS DATE) as date_val,
          SUM(d_reconciled) as move_reconciled,
          SUM(d_total) as move_total
        FROM operations
        WHERE date >= CAST(? AS DATE) AND date <= CAST(? AS DATE)
        GROUP BY account_id, CAST(date AS DATE)
      )
      SELECT 
        ad.account_id,
        DATE_FORMAT(ad.date, '%Y-%m-%d') as date,
        COALESCE(
          (SELECT initial_reconciled FROM initial_balance ib WHERE ib.account_id = ad.account_id), 0
        ) + COALESCE(
          SUM(m.move_reconciled) OVER (PARTITION BY ad.account_id ORDER BY ad.date ASC), 0
        ) as reconciled_balance,
        COALESCE(
          (SELECT initial_total FROM initial_balance ib WHERE ib.account_id = ad.account_id), 0
        ) + COALESCE(
          SUM(m.move_total) OVER (PARTITION BY ad.account_id ORDER BY ad.date ASC), 0
        ) as total_balance
      FROM account_dates ad
      LEFT JOIN daily_movements m ON m.account_id = ad.account_id AND m.date_val = ad.date
      ORDER BY ad.account_id ASC, ad.date ASC;
    `;

    // Parameters: start_date, end_date (for RECURSIVE dates), user_id (for accounts CTE),
    // user_id, user_id (for operations CTEs),
    // start_date (for initial_balance), start_date, end_date (for daily_movements)
    const [results] = await this.pool.execute(query, [
      dto.start_date,
      dto.end_date,
      dto.user_id,
      dto.user_id,
      dto.user_id,
      dto.start_date,
      dto.start_date,
      dto.end_date,
    ]);

    return results.map((row: any) => ({
      account_id: row.account_id,
      date: row.date,
      reconciled_balance: parseFloat(row.reconciled_balance || 0),
      total_balance: parseFloat(row.total_balance || 0),
    }));
  }

  /**
   * Met à jour les seules colonnes fournies.
   *
   * La version précédente relisait l'opération pour remplir les colonnes
   * absentes du DTO, alors que le usecase venait déjà de la lire pour sa garde
   * `OPERATION_NOT_FOUND` : quatre allers-retours pour une écriture, sur le
   * geste le plus répété du produit — le pointage passe par ici.
   *
   * La clause `SET` est construite à partir des clés présentes, et le test
   * reste `!== undefined` : un `null` explicite doit continuer de vider la
   * colonne. (Ne pas copier le `dto.x ? : old.x` d'`updateAccount`, qui teste
   * la véracité et ne peut donc jamais effacer une description.)
   */
  async updateOperation(
    dto: UpdateOperationServiceDto,
  ): Promise<OperationServiceModel> {
    const colonnes: [string, unknown][] = [
      ['account_id', dto.account_id],
      ['account_id_dest', dto.account_id_dest],
      ['amount', dto.amount],
      ['date', dto.date],
      ['status_id', dto.status_id],
      ['type_id', dto.type_id],
      ['third_id', dto.third_id],
      ['category_id', dto.category_id],
      ['vat_rate', dto.vat_rate],
      ['description', dto.description],
    ].filter(([, value]) => value !== undefined) as [string, unknown][];

    const query = `UPDATE operation SET
      ${colonnes.map(([nom]) => `${nom} = ?`).join(',\n      ')}${
        colonnes.length ? ',' : ''
      }
      modificator_id = ?,
      modification_date = current_date()
    WHERE 1=1
      AND id = ?
      AND creator_id = ?
      AND active = 1
    ;`;
    // `creator_id` au WHERE : le cloisonnement ne tenait qu'à la relecture
    // qu'on vient de supprimer, et l'UPDATE ne filtrait que sur l'id. La garde
    // métier reste dans le usecase, celle-ci est la barrière de fond (loi 1).
    await this.pool.execute(query, [
      ...colonnes.map(([, value]) => value),
      dto.user_id,
      dto.operation_id,
      dto.user_id,
    ]);
    return await this.getOperation({
      operation_id: dto.operation_id,
      user_id: dto.user_id,
    });
  }

  async deleteOperation(dto: DeleteOperationServiceDto): Promise<boolean> {
    const query = `UPDATE operation SET
      active = 0,
      modificator_id = ?,
      modification_date = current_date()
    WHERE 1=1
      AND id = ?
      AND active = 1
    ;`;
    await this.pool.execute(query, [dto.user_id, dto.operation_id]);
    return true;
  }

  async getOperationTypes(
    dto: GetOperationTypesServiceDto,
  ): Promise<OperationTypeServiceModel[]> {
    const query = `SELECT id,
        label,
        creator_id, 
        creation_date, 
        modificator_id, 
        modification_date
      FROM operation_type_list a
      WHERE 1=1
      AND a.active = 1
      AND ${sharedOrOwnedBy('a')}
    ;`;
    const [results] = await this.pool.execute(query, [dto.user_id]);
    return results;
  }

  async getOperationThrids(
    dto: GetOperationThridsServiceDto,
  ): Promise<OperationThridServiceModel[]> {
    const query = `SELECT id,
        label, 
        description, 
        creator_id, 
        creation_date, 
        modificator_id, 
        modification_date
      FROM operation_third_list a
      WHERE 1=1
      AND a.active = 1
      AND ${sharedOrOwnedBy('a')}
    ;`;
    const [results] = await this.pool.execute(query, [dto.user_id]);
    return results;
  }

  async getOperationStatus(): Promise<OperationStatutServiceModel[]> {
    const query = `SELECT id,
        label,
        creator_id,
        creation_date,
        modificator_id,
        modification_date
      FROM operation_status_list a
      WHERE 1=1
      AND a.active = 1
    ;`;
    const [results] = await this.pool.execute(query);
    return results;
  }

  async getOperationCategories(
    dto: GetOperationCategoriesServiceDto,
  ): Promise<OperationCategoryServiceModel[]> {
    const query = `SELECT id,
        label, 
        description, 
        creator_id, 
        creation_date, 
        modificator_id, 
        modification_date
      FROM operation_category_list a
      WHERE 1=1
      AND a.active = 1
      AND ${sharedOrOwnedBy('a')}
    ;`;
    const [results] = await this.pool.execute(query, [dto.user_id]);
    return results;
  }

  async createOperationLink(
    dto: CreateOperationLinkServiceDto,
  ): Promise<OperationLinkServiceModel> {
    const query = `INSERT INTO operation_link (operation_id, operation_ref_id, creator_id)
    VALUES (?, ?, ?)
    ;`;
    const [results] = await this.pool.execute(query, [
      dto.operation_id,
      dto.operation_ref_id,
      dto.user_id,
    ]);
    return await this.getOperationLink({
      operation_link_id: results.insertId,
      user_id: dto.user_id,
    });
  }

  /**
   * Lie en une seule instruction une opération portante à plusieurs opérations.
   *
   * Le cloisonnement n'est pas vérifié en amont puis appliqué : il **est** la
   * clause de sélection. Une opération qui n'appartient pas à l'utilisateur, ou
   * qui est supprimée, ne produit simplement aucune ligne — il n'y a rien à
   * contourner, et aucun aller-retour par identifiant.
   *
   * Le `NOT EXISTS` porte sur une table dérivée et non sur `operation_link`
   * directement : MariaDB refuse de référencer la table cible d'un INSERT dans
   * sa propre sous-requête. Il évite de recréer un lien déjà actif — le doublon
   * présent en production vient d'un double envoi du formulaire.
   */
  async createOperationLinks(
    dto: CreateOperationLinksServiceDto,
  ): Promise<OperationLinkServiceModel[]> {
    const ids = [...new Set(dto.operation_ref_ids)].filter(
      (id) => Number.isInteger(id) && id !== dto.operation_id,
    );

    if (ids.length === 0) {
      return [];
    }

    const placeholders = ids.map(() => '?').join(', ');
    const query = `INSERT INTO operation_link (operation_id, operation_ref_id, creator_id)
      SELECT ?, o.id, ?
        FROM operation o
       WHERE o.id IN (${placeholders})
         AND o.creator_id = ?
         AND o.active = 1
         AND NOT EXISTS (
           SELECT 1
             FROM (SELECT operation_id, operation_ref_id, active
                     FROM operation_link) x
            WHERE x.active = 1
              AND x.operation_id = ?
              AND x.operation_ref_id = o.id
         )
    ;`;
    await this.pool.execute(query, [
      dto.operation_id,
      dto.user_id,
      ...ids,
      dto.user_id,
      dto.operation_id,
    ]);

    return await this.getOperationLinks({
      operation_id: dto.operation_id,
      user_id: dto.user_id,
    });
  }

  async getOperationLink(
    dto: GetOperationLinkServiceDto,
  ): Promise<OperationLinkServiceModel> {
    const query = `SELECT id,
        operation_id,
        operation_ref_id,
        active,
        creator_id,
        creation_date,
        modificator_id,
        modification_date
      FROM operation_link a
      WHERE 1=1
      AND a.active = 1
      AND a.id = ?
      AND a.creator_id = ?
    ;`;
    // L'ordre des liaisons suit celui des `?` dans le texte de la requête, et
    // non celui des champs du DTO. Inversées, elles cherchaient le lien
    // n° <user_id> appartenant à l'utilisateur n° <operation_link_id> : la
    // lecture ne rendait jamais rien, et `createOperationLink`, qui relit par
    // ici, renvoyait donc null après avoir pourtant inséré sa ligne.
    const [results] = await this.pool.execute(query, [
      dto.operation_link_id,
      dto.user_id,
    ]);
    if (results.length > 0) {
      return results[0];
    } else {
      return null;
    }
  }

  async getOperationLinks(
    dto: GetOperationLinksServiceDto,
  ): Promise<OperationLinkServiceModel[]> {
    // La clause FROM visait le référentiel des catégories, copié de
    // getOperationCategories : une table qui n'a ni operation_id ni
    // operation_ref_id. La requête échouait sur « Unknown column » à chaque
    // appel, et la query GraphQL `operationLinks` avec elle.
    const query = `SELECT id,
        operation_id,
        operation_ref_id,
        active,
        creator_id,
        creation_date,
        modificator_id,
        modification_date
      FROM operation_link a
      WHERE 1=1
      AND a.active = 1
      AND a.operation_id = ?
      AND a.creator_id = ?
    ;`;
    const [results] = await this.pool.execute(query, [
      dto.operation_id,
      dto.user_id,
    ]);
    return results;
  }

  /**
   * Les opérations reliées à une opération, dans un sens ou dans l'autre.
   *
   * `direction` choisit deux **noms de colonnes**. Ils ne sont jamais
   * interpolés depuis une saisie : le type est une union fermée côté
   * TypeScript, et la valeur vient du resolver, pas du client.
   *
   * Le filtre `o.active = 1` n'est pas décoratif : des liens actifs pointent
   * vers des opérations supprimées logiquement. Sans lui, le détail listerait
   * des lignes que la liste ne montre plus, et le compteur ne collerait pas.
   */
  async getLinkedOperations(
    dto: GetLinkedOperationsServiceDto,
  ): Promise<LinkedOperationServiceModel[]> {
    const [pivot, target] =
      dto.direction === LINK_DIRECTION.DOWN
        ? ['operation_id', 'operation_ref_id']
        : ['operation_ref_id', 'operation_id'];

    const query = `SELECT
        l.id AS link_id,
        o.id,
        o.account_id,
        o.account_id_dest,
        o.amount,
        o.date,
        o.status_id,
        o.type_id,
        o.third_id,
        o.category_id,
        o.description
      FROM operation_link l
      JOIN operation o ON o.id = l.${target}
      WHERE 1=1
      AND l.active = 1
      AND l.creator_id = ?
      AND l.${pivot} = ?
      AND o.active = 1
      AND o.creator_id = ?
      ORDER BY o.date DESC, o.id DESC
    ;`;
    const [results] = await this.pool.execute(query, [
      dto.user_id,
      dto.operation_id,
      dto.user_id,
    ]);
    return results;
  }

  async deleteOperationLink(
    dto: DeleteOperationLinkServiceDto,
  ): Promise<boolean> {
    const query = `UPDATE operation_link SET
      active = 0,
      modificator_id = ?,
      modification_date = current_date()
    WHERE 1=1
      AND id = ?
      -- Sans ce filtre, n'importe quel utilisateur authentifié pouvait défaire
      -- le lien d'un autre : l'identifiant du lien suffisait.
      AND creator_id = ?
      AND active = 1
    ;`;
    const [results] = await this.pool.execute(query, [
      dto.user_id,
      dto.operation_link_id,
      dto.user_id,
    ]);
    // `true` inconditionnel masquait aussi bien un identifiant inconnu qu'un
    // lien déjà supprimé.
    return results.affectedRows > 0;
  }

  async cloneOperations(
    dto: CloneOperationsServiceDto,
  ): Promise<OperationServiceModel[]> {
    let query = `INSERT INTO operation (account_id, account_id_dest, amount, date, status_id, type_id, third_id, category_id, vat_rate, description, creator_id)
    SELECT ?, a.account_id_dest, a.amount, ?, a.status_id, a.type_id, a.third_id, a.category_id, a.vat_rate, a.description, ?
      FROM operation a, account b
    WHERE 1=1
      AND a.active = 1
      AND a.account_id = b.id
      AND b.id = ?
    ;`;
    let [results] = await this.pool.execute(query, [
      dto.account_id,
      dto.date,
      dto.user_id,
      dto.template_account_id,
    ]);
    query = `SELECT a.id,
        a.account_id,
        a.account_id_dest,
        a.amount,
        a.date,
        a.status_id,
        a.type_id,
        a.third_id,
        a.category_id,
        a.vat_rate,
        a.description,
        a.creator_id,
        a.creation_date,
        a.modificator_id,
        a.modification_date,
        -- Toujours 0/0 sur une opération qui vient d'être clonée, mais les deux
        -- champs sont non nullables : les omettre ne casserait que l'écran de
        -- clonage, et seulement lui.
        ${linkCountColumns('a')}
      FROM operation a
      WHERE 1=1
        AND a.id >= ?
      ORDER BY a.id DESC
      LIMIT ?
    ;`;
    [results] = await this.pool.execute(query, [
      results.insertId,
      results.affectedRows,
    ]);
    return results;
  }
}
