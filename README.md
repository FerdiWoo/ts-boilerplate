# TS Boilerplate

A small, production-minded Next.js boilerplate with a layered server
architecture. It is designed for starting new products quickly without carrying
any product domain code or operational integrations.

## Stack

- Next.js 16 App Router and React 19
- TypeScript in strict mode
- Tailwind CSS 4
- Neon Postgres through `postgres.js`
- Drizzle ORM and Drizzle Kit
- Zod 4
- Vitest
- Better Auth as an opt-in recipe

## Start a project

Use Node.js 22 or newer and npm 11 (the repository pins npm 11.11.0).

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Use the pooled Neon connection string for `DATABASE_URL`. The Drizzle client sets
`prepare: false`, which is compatible with transaction-pooling connections.

## Folder structure

```text
src/
├── app/
│   ├── (public)/               # anonymous and marketing routes
│   ├── (app)/                  # product routes and shared app shell
│   └── api/                    # HTTP-only entry points
├── features/                    # domain-owned vertical slices
│   └── projects/
│       ├── actions/             # authenticated mutation entry points
│       ├── client/              # browser-only stores, hooks, and adapters
│       ├── contracts/           # browser-safe Zod schemas and types
│       ├── server/              # queries, services, and repositories
│       └── ui/                  # feature-owned UI
├── components/                  # UI shared by multiple features
├── lib/
│   ├── actions/                # shared action-state and result helpers
│   └── ui/                     # shared UI utilities
└── server/
    ├── auth/                    # optional; add only when needed
    ├── db/
    │   ├── index.ts             # typed Drizzle client
    │   ├── seed.ts              # repeatable development data
    │   ├── test-db.ts           # lazy isolated test connection
    │   └── schema.ts            # all tables and enums
    ├── infrastructure/          # logging and operational adapters
    └── integrations/            # external service clients
```

Read [ARCHITECTURE.md](./ARCHITECTURE.md) before adding the first feature. The
included projects screen is a working vertical slice to copy or replace.

## Better Auth?

No, it is not intrinsically necessary. Use it when the application has users or
protected data. Keeping it out of the base means fewer tables, environment
variables, migrations, cookies, and security decisions for apps that do not need
identity. When it is needed, follow [docs/better-auth.md](./docs/better-auth.md).

## Checks

```bash
npm run check
npm run test:integration
npm run test:all
```

`npm run check` stays fast and runs unit tests only. Integration tests require
Docker and use a disposable PostgreSQL container with committed migrations.

Run `npm run db:push` only against a disposable development database. Prefer
generated, committed migrations everywhere else.
