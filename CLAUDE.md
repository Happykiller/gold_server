# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

API GraphQL de **Gold** (gestion bancaire et budgétaire) : NestJS + Apollo + MySQL. Le front
qui la consomme vit dans le dépôt voisin `gold_front` — voir `../CLAUDE.md` pour le contrat
entre les deux.

# Base de connaissance

La mémoire longue du projet est dans [`../docs/KB/`](../docs/KB/README.md), versionnée par le
dépôt orchestrateur `gold/` : architecture technique ([`DAT/`](../docs/KB/DAT/README.md)),
fonctionnelle ([`DAF/`](../docs/KB/DAF/README.md)), règles
([`REGLES/`](../docs/KB/REGLES/README.md)), outillage ([`MOTEUR.md`](../docs/KB/MOTEUR.md)) et
historique ([`HISTORY.md`](../docs/KB/HISTORY.md)).

**Avant d'agir sur un sujet, consulte l'index concerné.** `REGLES/lois.md` et
`REGLES/consignes.md` priment sur tes défauts. En fin de session utile, lance `/capitalize`.

> `README.md` est obsolète : il décrit un « Planning Poker » sans rapport avec ce projet.
> Ne pas s'y fier.

## Commandes

```bash
npm install
npm run start:mock          # NODE_ENV=mock — BddServiceFake, aucun MySQL requis
npm run start:dev           # NODE_ENV=dev — MySQL réel (exige src/config/dev.ts, cf. § Config)
npm run build && npm run start:prod
npm test                    # jest + coverage, fichiers *.spec.ts
npx jest src/usecase/getCashflow.usecase.spec.ts   # un seul test
npm run test:e2e            # config jest-e2e.json
npm run lint                # ESLint --fix + Prettier
npm run eros                # régénère docs/api/ depuis docs/gqlschema.gql
```

Docker : `make start` / `make startall` / `make down` (conteneur `gold_back`, 3001→3000).

## Architecture — 3 couches et un conteneur DI maison

```
presentation/  resolvers GraphQL + modules Nest
     ↓
usecase/       métier, une classe = une action
     ↓
service/       adaptateurs : bdd/ jwt/ crypt/ passwordless/ logger/
```

Le câblage **n'utilise pas les providers NestJS** mais un singleton manuel,
`src/inversify/investify.ts` (malgré son nom, aucun rapport avec la lib InversifyJS). Il
instancie tous les services et usecases (`new XUsecase(this)`) et choisit l'implémentation
selon `config.env.mode` : `BddServiceSQL` en `dev`/`prod`, `BddServiceFake` sinon ; idem pour
`PasswordLessServiceReal` / `…Fake`.

**Ajouter un usecase = trois gestes :**

1. `src/usecase/xxx.usecase.ts` — classe avec un constructeur `(inversify: Inversify)` et une
   méthode `execute(dto)` ;
2. la propriété et le `new` correspondants dans `investify.ts` ;
3. l'appel dans le resolver, via `import inversify from '@src/inversify/investify'`.

Les usecases sont fins : ils délèguent à `inversify.bddService` (cf. `getAccounts.usecase.ts`).
La logique SQL vit dans la couche service, pas dans le usecase.

## Couche base de données

`src/service/bdd/bdd.service.ts` est l'interface que doivent implémenter **les deux**
adaptateurs :

- `mysql/` — SQL réel, éclaté par domaine (`bdd.service.account.sql.ts`,
  `bdd.service.operation.sql.ts`, `db.service.user.mysql.ts`, `db.service.passkey.mysql.ts`),
  agrégés par `bdd.service.sql.ts` ;
- `fake/` — données en mémoire pour les modes `mock` et `test`.

Toute méthode ajoutée à l'interface doit l'être dans les deux, sinon les modes mock et test
cassent au démarrage.

## Authentification et cloisonnement

Auth, passkeys, user et system viennent de `@happykiller/sunny-apis` : `app.module.ts` monte
`AuthGuardModule`, `AuthModule`, `PasskeyModule`, `UserModule`, `SystemModule` en
`forRoot({ inversify, appConfig: config })`, et `main.ts` appelle `configureAuthGuardFactory`.
Dans les resolvers on utilise `makeAuthGuard(...)` avec `@UseGuards`, `@CurrentSession()` et
`USER_ROLE`.

**Règle de sécurité du domaine** : le `user_id` passé aux usecases provient toujours de la
session (`session.id`), jamais des arguments GraphQL — c'est ce qui cloisonne les données
entre utilisateurs. Ne jamais accepter un `user_id` venant du client.

## Configuration

`src/config/index.ts` fait `require('./' + process.env.NODE_ENV)` et fusionne le résultat
par-dessus `defaults.ts` (lodash `merge`). Les secrets (DB, JWT) sont lus depuis `.env` puis
`.env.local` (override) dans `defaults.ts`.

**Piège d'onboarding** : `src/config/dev.ts` et `src/config/prod.ts` sont gitignorés, et
`dev.ts` est absent du checkout — `npm run start:dev` échoue tant qu'on ne l'a pas créé. Le
calquer sur `mock.ts` / `test.ts` en renseignant le bloc `bdd`. Utiliser `start:mock` pour
travailler sans base.

## Base MySQL

Migrations SQL numérotées dans `src/migration/` (`00X-nom/do.sql`, parfois `undo.sql`),
appliquées **à la main** — aucun runner. À savoir :

- `001-install/001-schema` ne crée que la table `passkeys` ; le schéma métier (`account`,
  `operation`, `operation_link`, `account_type_list`, `operation_type_list`,
  `operation_status_list`, `operation_third_list`, `operation_category_list`) n'est pas dans le
  dépôt — récupérer un dump existant pour monter une base neuve ;
- `001-install/002-function` définit la fonction SQL `getBalance($account_id, $reconcilied)`,
  utilisée par les requêtes de solde ;
- `002-seed` insère les référentiels **fermés** sous forme de **clés i18n**
  (`account_type_list`, `operation_type_list`, `operation_status_list`,
  `operation_third_list` : `operation.type-credit`, `account.type-regular`, …) traduites côté
  front — ne pas renommer ces valeurs sans mettre à jour `gold_front/src/locales/`. En
  revanche `operation_category_list` n'a qu'une clé i18n (`operation.category-other`) : tout le
  reste est de la **donnée utilisateur** saisie depuis 2018, à ne pas traiter comme un
  référentiel.

## Conventions

- TypeScript, ESLint + Prettier (`singleQuote`, virgules finales), indentation 2 espaces.
- Nommage : `createAccount.usecase.ts`, `*.dto.ts`, `*.model.ts`, `*.resolver.ts`,
  `*.module.ts`, tests en `*.spec.ts` / `*.e2e-spec.ts` à côté du code couvert.
- Alias `@src`, `@presentation`, `@usecase`, `@service` — déclarés **en double** dans
  `tsconfig.json` et dans le `moduleNameMapper` de `jest.config.ts` : en ajouter un impose de
  toucher les deux fichiers.
- Ajouter ou mettre à jour un test dès qu'un resolver, un usecase, un service ou du SQL change.

## Documentation

- `docs/api/` est **généré** par `npm run eros` (`eros_gql`, config `eros.conf.json`) à partir
  de `docs/gqlschema.gql` — ne pas l'éditer à la main.
- `docs/http/` et `docs/sunny/` : requêtes manuelles prêtes à jouer (REST Client).
- `docs/req/` : requêtes SQL de référence.

## Commits & PR

Messages courts et impératifs, préfixes Conventional Commits quand c'est pertinent
(`feat: add account filter to operations query`). Une PR signale les changements de contrat
GraphQL, de configuration et de migration, et joint un exemple de requête pour tout changement
d'API.
