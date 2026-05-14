# Repository Guidelines

## Project Structure & Module Organization
`src/` contains the application code. Keep GraphQL resolvers and Nest modules in `src/presentation/`, business logic in `src/usecase/`, and infrastructure adapters in `src/service/` (`bdd/`, `jwt/`, `crypt/`, `passwordless/`, `logger/`). Shared helpers live in `src/common/` and environment-specific settings in `src/config/`. SQL migrations are stored under `src/migration/`. Reference material and manual API examples live in `docs/`, especially `docs/api/` and `docs/http/`.

## Build, Test, and Development Commands
Use `npm install` to sync dependencies. `npm run start:dev` runs the Nest server with `NODE_ENV=dev`; `npm run start:mock` uses mock config; `npm run build` compiles to `dist/`; `npm run start:prod` runs the compiled build. `npm test` runs unit tests with coverage, `npm run test:e2e` runs end-to-end tests, and `npm run lint` applies ESLint fixes. For containerized local work, `make start` launches Docker services and `make down` stops them.

## Coding Style & Naming Conventions
This repo uses TypeScript, ESLint, and Prettier. Prettier enforces `singleQuote: true` and trailing commas; use 2-space indentation to match the existing codebase. Follow current naming patterns: Nest classes and use cases use PascalCase file names such as `createAccount.usecase.ts`, DTOs end in `.dto.ts`, models end in `.model.ts`, and tests end in `.spec.ts` or `.e2e-spec.ts`. Prefer path aliases like `@service/...` and `@usecase/...` where already configured.

## Testing Guidelines
Jest is configured in `jest.config.ts` for unit tests and `jest-e2e.json` for integration flows. Place unit tests beside the code they cover, using the `*.spec.ts` suffix. Use `npm test` before opening a PR; add or update tests whenever resolver, use case, service, or SQL behavior changes. Keep coverage stable for modified areas rather than relying on unrelated legacy coverage.

## Commit & Pull Request Guidelines
Recent history shows short, imperative subjects with occasional Conventional Commit prefixes, for example `feat: ...`, `refacto ...`, and `upt ...`. Prefer clear commit messages such as `feat: add account filter to operations query`. PRs should summarize behavior changes, note config or migration impacts, link the issue when applicable, and include request or schema examples for API-facing changes.

## Security & Configuration Tips
Do not commit secrets or filled `.env` files. Document new environment variables in `README.md`, keep `NODE_ENV`-specific behavior inside `src/config/`, and review any changes to auth, JWT, passkeys, or SQL migrations carefully before merge.
