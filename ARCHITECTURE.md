# Architecture

```text
Browser
  -> src/app routes or src/features/<feature>/actions
  -> src/features/<feature>/server/*.service.ts
  -> src/features/<feature>/server/*.repository.ts
  -> src/server/db/index.ts
  -> Neon Postgres
```

## Responsibilities

- `src/app`: routing, layouts, HTTP entry points, and route-local composition.
- `src/features`: domain-owned actions, browser code, contracts, server logic, and UI.
- `src/components`: app-wide UI primitives and compositions used by multiple features.
- `src/lib`: framework-neutral helpers and shared UI-facing types.
- `src/features/<feature>/server/*.service.ts`: business rules, authorization, and orchestration.
- `src/features/<feature>/server/*.repository.ts`: Drizzle queries and transactions only.
- `src/features/<feature>/server/*.queries.ts`: server-rendering read entry points and request deduplication.
- `src/server/db/schema.ts`: every table and enum in one file. Split it into a `schema/` folder with an `index.ts` re-export once it grows.

## Route groups

- `src/app/(public)`: landing, login, legal, invitation, and other anonymous pages.
- `src/app/(app)`: product routes and their shared shell. Add authentication at this layout boundary when required.
- `src/app/api`: HTTP contracts for webhooks, downloads, third-party callers, and browser APIs. Server Components should call feature queries directly instead of fetching the app's own API.

## Shared components

- `src/components/ui`: accessible, typed primitives that wrap one native element and accept `className` overrides.
- `src/components/layout`: application-wide shells, headers, sidebars, and navigation composition.
- `src/components/providers`: providers genuinely shared across routes, added only when a real integration needs one.
- `src/components/shared`: cross-feature compositions with at least two real consumers.

Feature-specific UI remains in `src/features/<feature>/ui`.

## Shared libraries

- `src/lib/actions`: serializable action states and transport helpers shared by multiple features.
- `src/lib/ui`: framework-neutral helpers used by shared UI primitives.

Add categories such as `http`, `dates`, or `validation` only when real cross-feature consumers exist. Feature contracts remain with their owning feature.

## Hook ownership

Do not create a global `src/hooks` folder by default. Browser hooks owned by a feature belong in `src/features/<feature>/client`; hooks used by one route stay beside that route. Promote a hook to a shared location only after unrelated features establish a stable shared contract.

## Optional authentication

Authentication is not installed in the base. When required, use `src/server/auth` for the server-only provider configuration and `src/features/auth` for actions, browser code, contracts, and UI. Mount the provider under `src/app/api/auth`, keep generated provider tables in `src/server/db/schema`, and enforce sessions at the `(app)` layout plus every independently invocable action and route handler.

Follow `docs/better-auth.md` for the complete opt-in layout and migration workflow.

## Server infrastructure

Cross-domain operational adapters live under `src/server/infrastructure`. Use the shared structured logger instead of `console` in server code. It applies environment-aware levels and redacts credentials, tokens, cookies, authorization headers, auth secrets, and database URLs by default.

## Database development

- `src/server/db/seed.ts` provides idempotent local development data and refuses to run in production.
- `src/server/db/test-db.ts` lazily connects to the dedicated `TEST_DB_URL` so integration setup can inject an isolated database before first use.
- `src/server/db/templates/*.ts.example` are non-compiled discovery templates. Replace every placeholder before copying one into the active schema.
- Add `relations.ts` only when the Drizzle relational query API has a real consumer; foreign keys remain mandatory where the database relationship exists.

## Testing

Keep unit tests beside the code they exercise. `src/__tests__/integration` owns only cross-cutting database lifecycle, factories, and real boundary tests. Unit tests run without Docker; integration tests start disposable PostgreSQL with Testcontainers, apply committed Drizzle migrations, and clear application tables between tests.

## Automated guardrails

`scripts/check-placeholders.mjs` blocks active schemas, features, and migrations containing `table1`, `table2`, `entity1`, or `entity2`. The intentional files under `src/server/db/templates` are outside its scan roots. The check runs in both `npm run check` and production builds.

## Dependency rules

1. Routes call feature queries, actions, or services. They do not query Drizzle directly.
2. Services may call repositories. They should not know about forms or HTTP responses.
3. Repositories own persistence and return domain-shaped data.
4. Browser-safe schemas and types live in `contracts`; client modules never import feature server code.
5. Validate untrusted data at the boundary and again in the service when the service is public.
6. Keep server modules protected with `import 'server-only'`.
7. Infer TypeScript types from Zod and Drizzle instead of duplicating shapes.

## Adding a feature

For a `customer` feature, add files in this order:

```text
src/server/db/schema.ts   (add the customer table here)
src/features/customers/contracts/customers.schemas.ts
src/features/customers/server/customers.repository.ts
src/features/customers/server/customers.service.ts
src/features/customers/server/customers.queries.ts
src/features/customers/actions/customers.actions.ts
src/features/customers/ui/customer-form.tsx
src/app/customers/page.tsx
```

Generate and apply a migration after changing schema:

```bash
npm run db:generate
npm run db:migrate
```

Use `db:push` only for disposable development databases.
